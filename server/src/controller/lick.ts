const fs = require('fs');
import { Context } from "koa";
import { v4 as uuidv4 } from "uuid";
import * as util from 'util';
const ffmpeg = require('fluent-ffmpeg');

import { Lick } from "../entity/lick";
import { User } from "../entity/user";

import { StatusCodes } from "http-status-codes";
import {
    assertAudioFileValid,
    assertLickMetadataValid,
    assertLickAudioSaved,
    assertLickAudioLengthValid,
    assertLickTabbed,
    assertLickExists,
    assertRequesterCanAccessLick,
    assertRequesterIsLickOwner,
    getUserByEmailOrErrorResponse,
    assertUserIsNotRequester,
    assertLickValid
} from "./lickAssertions";
import { getManager, Repository } from "typeorm";

export class LickController {

    /**
     * POST /api/lick
     *
     * Upload new lick to be processed and have a tab generated.
     */
    public static async createLick(ctx: any): Promise<void> {

        const audioFile = ctx.request.files.file;

        if (!assertAudioFileValid(ctx, audioFile)) { return; }

        const body = ctx.request.body;
        const user = ctx.state.user;

        const lick: Lick = new Lick();
        lick.name = body.name;
        lick.dateUploaded = new Date();
        lick.tuning = body.tuning;
        lick.capo = parseInt(body.capo);
        lick.owner = user ? user : new User();

        if (!await assertLickMetadataValid(ctx, lick)) { return; }
        if (!await assertLickAudioSaved(ctx, lick, audioFile)) { return; }
        if (!await assertLickAudioLengthValid(ctx, lick)) { return; }
        if (!await assertLickTabbed(ctx, lick, body.skipTabbing)) { return; }

        if (user) {
            if (!await LickController.trySaveLickAndSetResponse(ctx, lick)) {
                await LickController.attemptToDeleteFile(lick.audioFileLocation);
            }
            // Override default OK status
            ctx.status = StatusCodes.CREATED;
        } else {
            await LickController.attemptToDeleteFile(lick.audioFileLocation);
            ctx.status = StatusCodes.CREATED;
            ctx.body = lick;
        }
    }

    /**
     * GET /api/lick/{id}
     *
     * Get a lick by id.
     */
    public static async getLick(ctx: Context): Promise<void> {

        const lick: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lick) || !assertRequesterCanAccessLick(ctx, lick)) { return; }

        // TODO: maybe hide attributes of lick.owner here, like email, not sure what so save for later
        ctx.status = StatusCodes.OK;
        ctx.body = lick;
    }

    /**
     * GET /api/licks/audio/{id}
     *
     * Get a lick's audio file by lick id.
     */
    public static async getLickAudio(ctx: Context): Promise<void> {

        const lick: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lick) || !assertRequesterCanAccessLick(ctx, lick)) { return; }

        ctx.status = StatusCodes.OK;
        const readFile = util.promisify(fs.readFile);
        ctx.body = await readFile(lick.audioFileLocation);
    }

    /**
     * GET /api/lick-count
     *
     * Get the total number of licks in the db.
     */
    public static async getLickCount(ctx: Context): Promise<void> {

        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);

        try {
            const { count } = await lickRepository
                .createQueryBuilder("lick")
                .select("COUNT(lick.id)", "count")
                .getRawOne();

            ctx.status = StatusCodes.OK;
            ctx.body = { count };
        } catch (error) {
            console.error(error)
            ctx.status = StatusCodes.BAD_REQUEST;
            ctx.body = { errors: {error: "Error: Could not count number of licks in db."}}
        }
    }


    /**
     * PUT /api/lick/update-shared-with/{id}
     *
     * Share or unshare a lick with another user by their email.
     */
    public static async updateLickSharedWith(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToUpdate) || !assertRequesterIsLickOwner(ctx, lickToUpdate)) {
            return;
        }

        const userToUpdate: User | undefined  = await getUserByEmailOrErrorResponse(ctx);
        if (userToUpdate === undefined || !await assertUserIsNotRequester(ctx, userToUpdate)) { return; }

        const body = ctx.request.body;

        if (body.share === true) {
            // TODO: could send back error response if below condition is true, meaning lick has already been shared with user
            if (!lickToUpdate.sharedWith.some(user => user.id === userToUpdate.id)) {
                lickToUpdate.sharedWith.push(userToUpdate)
            }
        } else if (body.share === false) {
            lickToUpdate.sharedWith =
                lickToUpdate.sharedWith.filter((user) => user.id !== userToUpdate.id);
        }

        await LickController.trySaveLickAndSetResponse(ctx, lickToUpdate)
    }

    /**
     * PUT /api/lick/unfollow/{id}
     *
     * Removes the authenticated user from the list of users the lick is shared with
     */
    public static async unfollowLick(ctx: Context): Promise<void> {

        const lickToUnfollow: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToUnfollow)) { return; }

        // works if lick was never shared with auth user in the first place
        const authUserId = ctx.state.user.id;
        lickToUnfollow.sharedWith =
            lickToUnfollow.sharedWith.filter((user) => user.id !== authUserId);

        await LickController.trySaveLickAndSetResponse(ctx, lickToUnfollow)
    }

    /**
     * PUT /api/lick/{id}
     *
     * Update a lick by id.
     */
    public static async updateLick(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToUpdate) || !assertRequesterIsLickOwner(ctx, lickToUpdate)) { return; }

        const body = ctx.request.body;

        // do manual checks here to allow same endpoint to update lick visibility and details
        if (body.makePublic !== undefined) {
            lickToUpdate.isPublic = body.makePublic;
        }
        // assert the name isnt empty
        if (body.name) {
            lickToUpdate.name = body.name;
        }
        if (body.desc !== undefined) {
            lickToUpdate.description = body.desc;
        }

        if (!await assertLickValid(ctx, lickToUpdate)) { return; }

        await LickController.trySaveLickAndSetResponse(ctx, lickToUpdate);
    }

    /**
     * PUT /api/lick/update-tab/{id}
     *
     * Update a licks tab after a user has manually edited it.
     */
    public static async updateTab(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToUpdate) ||  !assertRequesterIsLickOwner(ctx, lickToUpdate)) { return; }

        const body = ctx.request.body;
        if (body.tab !== undefined) {
            lickToUpdate.tab = body.tab;
        }

        await LickController.trySaveLickAndSetResponse(ctx, lickToUpdate);
    }

    /**
     * PUT /api/licks/re-tab/{id}
     *
     * Re-Tab a lick given a new tuning and / or capo
     */
    public static async reTabLick(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToUpdate) ||  !assertRequesterIsLickOwner(ctx, lickToUpdate)) { return; }

        const body = ctx.request.body;
        if (lickToUpdate.tuning === body.tuning && lickToUpdate.capo === body.capo) {
            // no work to do
            ctx.status = StatusCodes.OK;
            ctx.body = lickToUpdate;
            return;
        }

        lickToUpdate.tuning = body.tuning;
        lickToUpdate.capo = body.capo;

        if (!await assertLickValid(ctx, lickToUpdate)) { return; }
        if (!await assertLickTabbed(ctx, lickToUpdate, false)) { return; }

        await LickController.trySaveLickAndSetResponse(ctx, lickToUpdate);
    }

    /**
     * DELETE /api/lick/{id}
     *
     * Delete a lick by id.
     */
    public static async deleteLick(ctx: Context): Promise<void> {

        const lickToRemove: Lick | undefined = await LickController.getLickFromDbById(+ctx.params.id || 0);

        if (!assertLickExists(ctx, lickToRemove) ||  !assertRequesterIsLickOwner(ctx, lickToRemove)) { return; }

        try {
            await LickController.unlinkAsync(lickToRemove.audioFileLocation);
        } catch (err) {
            // ENOENT == file doesn't exist, let that case fail silently
            if (err.code !== 'ENOENT') {
                ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
                ctx.body = { errors: {error: "Error: Cant unlink lick from file system."}}
                return
            }
        }

        await LickController.tryRemoveLickAndSetResponse(ctx, lickToRemove);
    }

    /**
     * HELPERS
     */
    // TODO: this should really go in DAO layer, not here
    public static async getLickFromDbById(lickId: number): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.findOne({ where: {id: (lickId)}, relations: ['owner', 'sharedWith']});
    }

    // TODO: this should really go in DAO layer, not here
    public static async saveLickToDb(lick: Lick): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.save(lick);
    }

    // TODO: this should really go in DAO layer, not here
    public static async deleteLickFromDb(lick: Lick): Promise<Lick | undefined> {
        const lickRepository: Repository<Lick> = getManager().getRepository(Lick);
        return await lickRepository.remove(lick);
    }

    public static async trySaveLickAndSetResponse(ctx: Context, lick: Lick): Promise<boolean> {
        const updatedLick: Lick | undefined = await LickController.saveLickToDb(lick);

        if (!updatedLick) {
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "Error: Could not update lick in db"}} // should change this to could not save
            return false;
        }

        ctx.status = StatusCodes.OK;
        ctx.body = updatedLick;
        return true;
    }

    public static async tryRemoveLickAndSetResponse(ctx: Context, lick: Lick) {
        const removedLick: Lick | undefined = await LickController.deleteLickFromDb(lick);
        if (!removedLick) {
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "Error: Cant remove lick from database."}}
            return;
        }

        ctx.status = StatusCodes.OK;
        ctx.body = removedLick;
    }

    /**
     * UTILS
     */
    // TODO: make all these methods protected and add lick assertions to same package
    public static validateAudioFile(audioFile: any): Error | null {

        if (!audioFile) return new Error("Error: No file sent.")
        if (!audioFile.size) return new Error("Error: File is empty.")
        if (audioFile.size > 25000000) return new Error("Error: File must be less than 25MB.")

        // ffmpeg can convert most types of audio files, let it fail if it can't convert the audio file
        if (!audioFile.type.startsWith("audio/"))  return new Error("Error: Mimetype is not supported.");

        return null;
    }

    public static async saveAudioFile(audioFile: any): Promise<string> {

        // save the audio to a file with a randomly generated uuid
        const audioFileLocation: string = "uploads/" + uuidv4();

        // convert all file types to .wav before saving
        return new Promise((res, rej) => {
            ffmpeg(audioFile.path)
            .toFormat('wav')
            .on('error', (err) => {
                rej(err);
            })
            .on('end', () => {
                res(audioFileLocation);
            })
            .save(audioFileLocation);
        })
    }

    public static canUserAccess(user: User, lick: Lick): boolean {

        // The owner and sharedWith relations MUST exist be loaded on the lick passed in
        if (!lick.owner || !lick.sharedWith) {
            throw new Error('The owner and sharedWith relations MUST be loaded on lick parameter')
        }
        return lick.isPublic ||
                (user && (user.id == lick.owner.id)) ||
                (lick.sharedWith.some(user => user.id === user.id));
    }

    public static async attemptToDeleteFile(filePath: string): Promise<void> {
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
