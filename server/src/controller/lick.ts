import { validate, ValidationError } from "class-validator";
const fs = require('fs');
import * as audioDuration from 'get-audio-duration';
import { Context } from "koa";
import { getManager, Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import * as util from 'util';

import { Lick } from "../entity/lick";
import { User } from "../entity/user";
import { UserController } from './user'

export class LickController {

    /**
     * POST /api/licks
     *
     * Upload new lick to be processed and have a tab generated.
     */
    public static async createLick(ctx: any): Promise<void> {

        const audioFile = ctx.request.files.file;
        
        const err: Error = LickController.validateAudioFile(audioFile); 
        if (err) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: err.message}}
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
        lickToBeSaved.isPublic = body.isPublic == "true" ? true : false;
        lickToBeSaved.owner = ctx.state.user;
        lickToBeSaved.sharedWith = []; // TODO - list of shared with users will be sent from client upon lick creation
        
        const errors: ValidationError[] = await validate(lickToBeSaved);
        
        if (errors.length > 0) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors };
            return
        } 
        
        try {
            lickToBeSaved.audioFileLocation = await LickController.saveAudioFile(audioFile);
        } catch (err) {
            ctx.status = 500; // SERVER ERROR
            ctx.body = { errors: {error: err.message}}
            return
        }
        
        try {
            lickToBeSaved.audioLength = await audioDuration.getAudioDurationInSeconds(lickToBeSaved.audioFileLocation)
        } catch (err) {
            await LickController.attemptToDeleteFile(lickToBeSaved.audioFileLocation);
            ctx.status = 500; // SERVER ERROR
            ctx.body = { errors: {error: "Error: Cant get length of audio file."}}
            return
        }

        if (lickToBeSaved.audioLength > 60) { // lick is too long
            await LickController.attemptToDeleteFile(lickToBeSaved.audioFileLocation);
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: Audio file is longer than 60 seconds."}}
            return
        }

        // finally, save the lick to the database
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lick: Lick | undefined = await lickRepository.save(lickToBeSaved);

        if (!lick) {
            ctx.status = 500; // SERVER ERROR
            ctx.body = { errors: {error: "Error: Cant save lick to database."}}
        } else {
            ctx.status = 201; // CREATED
            ctx.body = lick;
        }
    }

    /**
     * GET /api/licks/{id}
     *
     * Get a lick by id.
     */
    public static async getLick(ctx: Context): Promise<void> {

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lick: Lick | undefined = await lickRepository.findOne({ where: {id: (+ctx.params.id || 0)}, relations: ['owner', 'sharedWith']});

        if (lick) {
            const isPermitted = LickController.canUserAccess(ctx.state.user, lick);
            if (isPermitted) {
                ctx.status = 200; // OK

                // should hide some attributes of lick.owner here, like email, not sure what so save for later
                ctx.body = lick;
            } else {
                ctx.status = 403; // FORBIDDEN
                ctx.body = { errors: {error: "Error: You do not have permission to access this lick."}}
            }
        } else {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The lick you are trying to retrieve doesn't exist."}}
        }
    }

    /**
     * GET /api/licks/audio/{id}
     *
     * Get a lick's audio file by lick id.
     */
    public static async getLickAudio(ctx: Context): Promise<void> {

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lick: Lick | undefined = await lickRepository.findOne({ where: {id: (+ctx.params.id || 0)}, relations: ['owner', 'sharedWith']});

        if (lick) {
            const isPermitted = LickController.canUserAccess(ctx.state.user, lick);
            if (isPermitted) {
                ctx.status = 200; // OK
                const readFile = util.promisify(fs.readFile);
                ctx.body = await readFile(lick.audioFileLocation);
            } else {
                ctx.status = 403; // FORBIDDEN
                ctx.body = { errors: {error: "Error: You do not have permission to access the audio for this lick."}}
            }
        } else {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The audio for the lick you are trying to retrieve doesn't exist."}}
        }
    }

    /**
     * PUT /api/lick/share/{id}
     *
     * Share a lick with another user by id.
     */
    public static async shareLick(ctx: Context): Promise<void> {

        const lickID = +ctx.params.id || 0;
        const userIDToShareWith = ctx.request.body.userID || 0;

        if (userIDToShareWith == ctx.state.user.id) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: Cannot share a lick with yourself."}}
            return
        }

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lickToBeShared: Lick | undefined = await lickRepository.findOne({ where: {id: (lickID)}, relations: ['owner', 'sharedWith']});

        if (!lickToBeShared) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The lick you are trying to share doesn't exist."}}
        } else if (ctx.state.user.id !== lickToBeShared.owner.id) {
            ctx.status = 403; // FORBIDDEN
            ctx.body = { errors: {error: "Error: A lick can only be shared by its owner."}}
        } else {
            const sharedWithUser: User | undefined = await UserController.getUserByID(userIDToShareWith);

            if (!sharedWithUser) {
                ctx.status = 400; // BAD REQUEST
                ctx.body = { errors: {error: "Error: The user you are trying to share with doesn't exist in the db"}}
            } else {
                if (!lickToBeShared.sharedWith.some(user => user.id === sharedWithUser.id)) {
                    lickToBeShared.sharedWith.push(sharedWithUser)
                }
                // relation cascades on update, so only need to update lick entity
                const sharedLick: Lick | undefined = await lickRepository.save(lickToBeShared);
                if (!sharedLick) {
                    ctx.status = 500; // SERVER ERROR
                    ctx.body = { errors: {error: "Error: Could not update lick to be shared with user in db"}}
                } else {
                    ctx.status = 200; // OK
                    ctx.body = sharedLick;
                }
            }
        }
    }

    /**
     * PUT /api/lick/unshare/{id}
     *
     * Unshare a lick with another user by id.
     */
    public static async unshareLick(ctx: Context): Promise<void> {

        const lickID = +ctx.params.id || 0;

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lickToBeUnshared: Lick | undefined = await lickRepository.findOne({ where: {id: (lickID)}, relations: ['owner', 'sharedWith']});
        
        if (!lickToBeUnshared) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The lick you are trying to unshare doesn't exist."}}
        } else if (ctx.state.user.id !== lickToBeUnshared.owner.id) {
            ctx.status = 403; // FORBIDDEN
            ctx.body = { errors: {error: "Error: A lick can only be unshared by its owner."}}
        } else {
            const userToUnshare: User | undefined = await UserController.getUserByID(+ctx.request.body.userID || 0);

            if (!userToUnshare) {
                ctx.status = 400; // BAD REQUEST
                ctx.body = { errors: {error: "Error: The user you are trying to unshare with doesn't exist in the db"}}
            } else {
                // filter out user to unshare with by ID
                // allows a lick to be unshared with user if not shared with in the first place
                lickToBeUnshared.sharedWith =
                lickToBeUnshared.sharedWith.filter((user) => {
                    return user.id !== userToUnshare.id
                });
                // relation cascades on update, so only need to update lick entity
                const unsharedLick: Lick | undefined = await lickRepository.save(lickToBeUnshared);
                if (!unsharedLick) {
                    ctx.status = 500; // SERVER ERROR
                    ctx.body = { errors: {error: "Error: Could not update lick to unshared with user in db"}}
                } else {
                    ctx.status = 200; // OK
                    ctx.body = unsharedLick;
                }
            }
        }
    }

    /**
     * PUT /api/lick/unfollow/{id}
     *
     * Removes the authenticated user from the list of users the lick is shared with
     */
    public static async unfollowLick(ctx: Context): Promise<void> {

        const lickID = +ctx.params.id || 0;
        const thisUserID = ctx.state.user.id;

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        const lickToUnfollow: Lick | undefined = await lickRepository.findOne({ where: {id: (lickID)}, relations: ['sharedWith']});
        
        if (!lickToUnfollow) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The lick you are trying to unfollow doesn't exist."}}
        } else {
            // filter out the user trying to unfollow by ID
            // allows a lick to be unfollowed by user if not shared with in the first place
            lickToUnfollow.sharedWith =
                lickToUnfollow.sharedWith.filter((user) => {
                    return user.id !== thisUserID
                });
            // relation cascades on update, so only need to update lick entity
            const unfollowedLick: Lick | undefined = await lickRepository.save(lickToUnfollow);
            if (!unfollowedLick) {
                ctx.status = 500; // SERVER ERROR
                ctx.body = { errors: {error: "Error: Could not update lick to allow user to unfollow in db"}}
            } else {
                ctx.status = 204; // NO CONTENT
            }
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

        const lickRepository = getManager().getRepository(Lick);
        const lickToRemove: Lick | undefined = await lickRepository.findOne({ where: {id: (+ctx.params.id || 0)}, relations: ['owner']});

        if (!lickToRemove) {
            ctx.status = 400; // BAD REQUEST
            ctx.body = { errors: {error: "Error: The lick you are trying to delete doesn't exist."}}
        } else if (ctx.state.user.id !== lickToRemove.owner.id) {
            ctx.status = 403; // FORBIDDEN
            ctx.body = { errors: {error: "Error: A lick can only be deleted by its owner."}}
        } else {
            const err: NodeJS.ErrnoException = await LickController.unlinkAsync(lickToRemove.audioFileLocation);
            if (err) {
                // ENOENT == file doesn't exist, let that case fail silently
                if (err.code != 'ENOENT') {
                    ctx.status = 500;
                    ctx.body = { errors: {error: "Error: Cant unlink lick from file system."}}
                    return
                }
            }

            const removedLick: Lick | undefined = await lickRepository.remove(lickToRemove);
            if (!removedLick) {
                ctx.status = 500; // SERVER ERROR
                ctx.body = { errors: {error: "Error: Cant remove lick from database."}}
            } else {
                ctx.status = 200; // OK
                ctx.body = removedLick;
            }
        }
    }

    /**
     * HELPERS
     */
    private static validateAudioFile(audioFile: any): Error | null {
    
        if (!audioFile) return new Error("Error: No file sent.")
        if (!audioFile.size) return new Error("Error: File is empty.")
        if (audioFile.size > 25000000) return new Error("Error: File must be less than 25MB.")
        
        // decide on supported types later
        const supportedTypes: string[] = ["audio/mpeg", "audio/wave", "audio/mp4"]
        if (!supportedTypes.includes(audioFile.type)) return new Error("Error: Mimetype is not supported.")
        
        return null;
    }

    private static async saveAudioFile(audioFile: any): Promise<string> {

        // save the audio to a file with a randomly generated uuid
        const audioFileLocation: string = "uploads/" + uuidv4();
        
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

    private static canUserAccess(user: User, lick: Lick): boolean {
        // The owner and sharedWith relations MUST exist be loaded on the lick passed in
        if (!lick.owner || !lick.sharedWith) {
            throw new Error('The owner and sharedWith relations MUST be loaded on lick parameter')
        }
        return lick.isPublic ||
                (user && (user.id == lick.owner.id)) ||
                (lick.sharedWith.some(user => user.id === user.id));
    }

    private static async attemptToDeleteFile(filePath: string): Promise<void> {
        const deleteFile = util.promisify(fs.unlink);
        try {
            await deleteFile(filePath);
        } catch (e) {
            console.error(e)
        }
    }

    // Made this a private class function so it could be easily stubbed when testing
    private static async unlinkAsync(filePath: string) : Promise<NodeJS.ErrnoException> {
        const deleteFile = util.promisify(fs.unlink);
        return await deleteFile(filePath);
    } 
}