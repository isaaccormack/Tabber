import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Context, Request } from "koa";
import { Lick } from "../entity/lick";
import { User } from "../entity/user";
import { Files } from "koa2-formidable";
const fs = require('fs');
import * as util from 'util';
import * as audioDuration from 'get-audio-duration';


const lickAudioDirectory: string = "uploads";

// Get a new unique location for an audio file
function getNewAudioFileUri(): string {
    return lickAudioDirectory + "/" + uuidv4();
    // return uuidv4();
}

// files must be added to Request interface
interface FileRequest extends Request {
    files?: Files;
}

interface FileContext extends Context {
    request: FileRequest;
}


export class LickController {

    /**
     * GET /api/licks/{id}
     *
     * Get a lick by id.
     */
    public static async getLick(ctx: Context): Promise<void> {

        // get a lick repository to perform operations with licks
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        // load lick by id
        const lick: Lick | undefined = await lickRepository.findOne(+ctx.params.id || 0);

        if (lick) {
            // verify user has permissions
            const isPermitted = this.canUserAccess(ctx.state.user, lick);
            if (isPermitted) {
                // return OK status code and loaded lick object
                ctx.status = 200;
                ctx.body = lick;
            } else {
                // return FORBIDDEN status code
                ctx.status = 403;
                ctx.body = "You do not have permission to access this lick";
            }
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The lick you are trying to retrieve doesn't exist";
        }
    }

    /**
     * GET /api/licks/audio/{id}
     *
     * Get a lick's audio file by lick id.
     */
    public static async getLickAudio(ctx: Context): Promise<void> {

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        const lick: Lick | undefined = await lickRepository.findOne(+ctx.params.id || 0);

        if (lick) {
            // verify user has permissions
            const isPermitted = this.canUserAccess(ctx.state.user, lick);
            if (isPermitted) {
                // return OK status code and loaded audio file
                ctx.status = 200;
                ctx.body = await fs.readFile(lick.audioFileLocation);
            } else {
                // return FORBIDDEN status code
                ctx.status = 403;
                ctx.body = "You do not have permission to access this lick";
            }
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The lick you are trying to retrieve doesn't exist";
        }
    }

    /**
     * POST /api/licks
     *
     * Upload new lick to be processed and have a tab generated.
     */
    public static async createLick(ctx: any): Promise<void> {

        const audioFile = ctx.request.files.file;
        
        const err: Error = this.validateAudioFile(audioFile);
        if (err) {
            ctx.status = 400;
            ctx.body = err.message;
            return
        }

        const body = ctx.request.body;

        // add user specified attributes to lick to be validated
        const lickToBeSaved: Lick = new Lick();
        lickToBeSaved.name = ctx.request.body.name;
        lickToBeSaved.description = body.description ? body.description : "";
        lickToBeSaved.dateUploaded = new Date();
        lickToBeSaved.tab = ""; // initally empty, tab not generated yet
        lickToBeSaved.tuning = body.tuning;
        lickToBeSaved.isPublic = body.isPublic;
        lickToBeSaved.owner = ctx.state.user;
        lickToBeSaved.sharedWith = []; // TODO - list of shared with users will be sent from client upon lick creation
        
        const errors: ValidationError[] = await validate(lickToBeSaved);
        
        if (errors.length > 0) {
            ctx.status = 400;
            ctx.body = errors;
            return
        } 
        
        try {
            lickToBeSaved.audioFileLocation = await this.saveAudioFile(audioFile);
        } catch (err) {
            ctx.status = 500;
            ctx.body = err.message;
            return
        }
        
        try {
            lickToBeSaved.audioLength = await audioDuration.getAudioDurationInSeconds(lickToBeSaved.audioFileLocation)
        } catch (err) {
            await this.attemptToDeleteFile(lickToBeSaved.audioFileLocation);
            ctx.status = 500;
            ctx.body = "Error: Cant get length of audio file.";
            return
        }

        if (lickToBeSaved.audioLength > 60) { // lick is too long
            await this.attemptToDeleteFile(lickToBeSaved.audioFileLocation);
            ctx.status = 400;
            ctx.body = "Error: Audio file is longer than 60 seconds.";
            return
        }

        // finally, save the lick to the database
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lick = await lickRepository.save(lickToBeSaved);

        ctx.status = 201;
        ctx.body = lick;
    }

    private static async attemptToDeleteFile(filePath: string): Promise<void> {
        const deleteFile = util.promisify(fs.unlink);
        try {
            await deleteFile(filePath);
        } catch (e) {
            console.error(e)
        }
    }


    /**
     * PUT /api/licks/{id}
     *
     * Update a lick by id.
     */
    public static async updateLick(ctx: Context): Promise<void> {
        // TODO: implement this along with a frontend for it.
        return;
    }

    /**
     * DELETE /api/licks/{id}
     *
     * Delete a lick by id.
     */
    public static async deleteLick(ctx: Context): Promise<void> {

        // get a lick repository to perform operations with licks
        const lickRepository = getManager().getRepository(Lick);

        // find the lick by specified id
        const lickToRemove: Lick | undefined = await lickRepository.findOne(+ctx.params.id || 0);

        if (!lickToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The lick you are trying to delete doesn't exist";
        } else if (ctx.state.user !== lickToRemove.owner) {
            // check user's token id and owner id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.body = "A lick can only be deleted by its owner";
        } else {
            // the lick is there so can be removed
            await lickRepository.remove(lickToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }

    /**
     * HELPERS
     */
    // audioFile should be of some file type or multipart/formdata type
    // would be cleaner just to have an AudioFile entity which links to lick and validate it that way
    private static validateAudioFile(audioFile: any): Error | null {
    
        if (!audioFile) return new Error("Error: No file sent.")
        if (!audioFile.size) return new Error("Error: File is empty.")
        if (audioFile.size > 25000000) return new Error("Error: File must be less than 25MB.")
        
        // decide on supported types later
        const supportedTypes: string[] = ["audio/mpeg", "audio/wav", "audio/mp4"]
        if (!supportedTypes.includes(audioFile.type)) return new Error("Error: Mimetype is not supported.")
        
        return null;
    }

    private static async saveAudioFile(audioFile: any): Promise<string> {

        // save the audio to a file with a randomly generated uuid
        const audioFileLocation: string = getNewAudioFileUri();
        
        // create read and write streams to save file
        const readStream = fs.createReadStream(audioFile.path);
        const writeStream = fs.createWriteStream(audioFileLocation);
        
        // asynchronously read from sent file and write to local file
        for await (const chunk of readStream) {
            const err: Error = await writeStream.write(chunk);
            if (err) {
                // try to delete file created, if any was
                try {
                    await fs.unlink(audioFileLocation);
                } catch (e) {
                    // let this fail silently, already in the midst of an exception
                }
                throw err;
            }
        }

        return audioFileLocation;
    }

    // TODO: test whether these comparisons work correctly & are a reasonably efficient way to do things
    private static canUserAccess(user: User, lick: Lick): boolean {
        // TODO: fix the shared with validation when implementing that functionality
        return lick.isPublic || lick.owner.id == user.id || lick.sharedWith.indexOf(user) !== -1;
    }

    private static canUserModify(user: User, lick: Lick): boolean {
        return lick.owner == user;
    }
}