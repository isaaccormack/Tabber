import { validate, ValidationError } from "class-validator";
import { getManager, Repository, Not, Equal, Like } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Context } from "koa";
import { Lick } from "../entity/lick";
import { User } from "../entity/user";
const fs = require('fs').promises;

const lickAudioDirectory: string = "uploads";

export class LickController {

    /**
     * POST /api/licks
     *
     * Upload new lick to be processed and have a tab generated.
     */
    public static async createLick(ctx: Context): Promise<void> {

        // get a lick repository to perform operations with licks
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        // save the audio to a file (with a randomly-generated ID)
        const audio: any = ctx.request.body;
        const audioFileLocation: string = this.getNewAudioFileUri();
        // TODO: fix this. not sure why this is an issue; fs.writeFile is supposed to have a promise-based variation
        await fs.writeFile(audioFileLocation, audio);

        // get current date for uploading
        const currentDateTime = new Date();

        // build up lick entity to be saved
        const lickToBeSaved: Lick = new Lick();
        lickToBeSaved.name = "Lick from " + currentDateTime.toISOString();
        lickToBeSaved.description = "";
        lickToBeSaved.dateUploaded = currentDateTime;
        lickToBeSaved.audioFileLocation = audioFileLocation; // audio file location doesn't need to be returned to frontend (but is anyway)
        lickToBeSaved.audioLength = 0;
        lickToBeSaved.tab = "TBD";
        lickToBeSaved.tuning = "TBD";
        lickToBeSaved.isPublic = false;
        lickToBeSaved.owner = ctx.state.user;
        lickToBeSaved.sharedWith = [];

        // validate lick entity
        const errors: ValidationError[] = await validate(lickToBeSaved); // errors is an array of validation errors

        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        } else {
            // save the lick
            const lick = await lickRepository.save(lickToBeSaved);
            // return CREATED status code and the created lick
            ctx.status = 201;
            ctx.body = lick;
        }

    }

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

    // TODO: test whether these comparisons work correctly & are a reasonably efficient way to do things
    private static canUserAccess(user: User, lick: Lick): boolean {
        return lick.isPublic || lick.owner == user || lick.sharedWith.indexOf(user) !== -1;
    }

    private static canUserModify(user: User, lick: Lick): boolean {
        return lick.owner == user;
    }

    // Get a new unique location for an audio file
    private static getNewAudioFileUri(): string {
        return lickAudioDirectory + "/" + uuidv4();
    }
}