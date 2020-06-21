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
import { UserController } from './user'


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

    // this is just a subset of finding a lick and probably doesnt need to exist
    // ie. instead just get a lick and look at who its shared with
    // /**
    //  * GET /api/licks/sharedWith/{id}
    //  *
    //  * Get users a lick is shared with by id.
    //  */
    // public static async getUsersLickSharedWith(ctx: Context): Promise<void> {

    //     const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    //     const lick: Lick | undefined = await lickRepository.findOne({ where: {id: (+ctx.params.id || 0)}, relations: ['owner', 'sharedWith']});

    //     if (lick) {
    //         const isPermitted = LickController.canUserAccess(ctx.state.user, lick);
    //         if (isPermitted) {
    //             ctx.status = 200; // OK

    //             // should hide some attributes of lick.owner here, like email, not sure what so save for later
    //             ctx.body = lick;
    //         } else {
    //             ctx.status = 403; // FORBIDDEN
    //             ctx.body = { errors: {error: "Error: You do not have permission to see the users this lick is shared with."}}
    //         }
    //     } else {
    //         ctx.status = 400; // BAD REQUEST
    //         ctx.body = { errors: {error: "Error: The lick you are trying to get the shared with users of doesn't exist."}}
    //     }
    // }

    // should include share date in shared with relation

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

    // maybe the make public should just be one case in the edit lick handler

    // /**
    //  * PUT /api/makePrivate/lick/{id}
    //  *
    //  * Makes the requested lick private 
    //  */
    // public static async makeLickPrivate(ctx: Context): Promise<void> {

    //     const lickID = +ctx.params.id || 0;

    //     const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    //     const lickToMakePrivate: Lick | undefined = await lickRepository.findOne(lickID);
        
    //     if (!lickToMakePrivate) {
    //         ctx.status = 400; // BAD REQUEST
    //         ctx.body = { errors: {error: "Error: The lick you are trying to make private doesn't exist."}}
    //     } else if (ctx.state.user.id !== lickToMakePrivate.owner.id) {
    //         ctx.status = 403; // FORBIDDEN
    //         ctx.body = { errors: {error: "Error: A lick can only be made private by its owner."}}
    //     } else {
    //         lickToMakePrivate.isPublic = false;
    //         // relation cascades on update, so only need to update lick entity
    //         const privateLick: Lick | undefined = await lickRepository.save(lickToMakePrivate);
    //         if (!privateLick) {
    //             ctx.status = 500; // SERVER ERROR
    //             ctx.body = { errors: {error: "Error: Could not update lick to make private in db"}}
    //         } else {
    //             ctx.status = 200; // OK
    //             ctx.body = privateLick;
    //         }
    //     }
    // }

    // /**
    //  * PUT /api/makePublic/lick/{id}
    //  *
    //  * Makes the requested lick public
    //  */
    // public static async makeLickPublic(ctx: Context): Promise<void> {

    //     const lickID = +ctx.params.id || 0;

    //     const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
    //     const lickToMakePublic: Lick | undefined = await lickRepository.findOne(lickID);
        
    //     if (!lickToMakePublic) {
    //         ctx.status = 400; // BAD REQUEST
    //         ctx.body = { errors: {error: "Error: The lick you are trying to make public doesn't exist."}}
    //     } else if (ctx.state.user.id !== lickToMakePublic.owner.id) {
    //         ctx.status = 403; // FORBIDDEN
    //         ctx.body = { errors: {error: "Error: A lick can only be made public by its owner."}}
    //     } else {
    //         lickToMakePublic.isPublic = true;
    //         // relation cascades on update, so only need to update lick entity
    //         const publicLick: Lick | undefined = await lickRepository.save(lickToMakePublic);
    //         if (!publicLick) {
    //             ctx.status = 500; // SERVER ERROR
    //             ctx.body = { errors: {error: "Error: Could not update lick to make public in db"}}
    //         } else {
    //             ctx.status = 200; // OK
    //             ctx.body = publicLick;
    //         }
    //     }
    // }



    // get all user licks

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
    // audioFile should be of some file type or multipart/formdata type
    // would be cleaner just to have an AudioFile entity which links to lick and validate it that way
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

    // The sharedWith relation MUST be loaded with lick passed in 
    private static canUserAccess(user: User, lick: Lick): boolean {
        // TODO: fix the shared with validation when implementing that functionality
        // note: will have to change query to get sharedWith attribute of lick
        // doesn't handle shared with
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

    private static canUserModify(user: User, lick: Lick): boolean {
        return lick.owner == user;
    }
}