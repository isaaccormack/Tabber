const fs = require('fs');
import { Context } from "koa";
import * as util from 'util';
import { StatusCodes } from "http-status-codes";

import { Lick } from "../entity/lick";
import { User } from "../entity/user";
import { LickAssertions } from "./lickAssertions";
import { LickDAO } from "../dao/lick";
import { LickUtils } from "./lickUtils";
import { LickCountDAO } from "../dao/lickCount";
const logger = require('../winston/winston');

export class LickController {

    /**
     * POST /api/lick
     *
     * Upload new lick to be processed and have a tab generated.
     */
    public static async createLick(ctx: any): Promise<void> {

        const audioFile = ctx.request.files.file;

        if (!LickAssertions.audioFileValid(ctx, audioFile)) { return; }

        const body = ctx.request.body;
        const user = ctx.state.user;

        const lick: Lick = new Lick();
        lick.name = body.name;
        lick.dateUploaded = new Date();
        lick.tuning = body.tuning;
        lick.capo = parseInt(body.capo);
        lick.owner = user ? user : new User();

        if (!await LickAssertions.metadataValid(ctx, lick)) { return; }
        if (!await LickAssertions.audioFileSaved(ctx, lick, audioFile)) { return; }
        if (!await LickAssertions.audioLengthValid(ctx, lick)) { return; }
        if (!await LickAssertions.tabbedSuccessfully(ctx, lick)) { return; }

        if (user) {
            if (await LickAssertions.lickSaved(ctx, lick)) {
                // Override default OK status
                ctx.status = StatusCodes.CREATED;
            } else {
                await LickUtils.attemptToDeleteFile(lick.audioFileLocation);
            }
        } else {
            await LickUtils.attemptToDeleteFile(lick.audioFileLocation);
            ctx.status = StatusCodes.CREATED;
            ctx.body = lick;
        }

        if (ctx.status === StatusCodes.CREATED) {
            try {
                await LickCountDAO.incrementLickCountInDB();
            } catch (err) {
                logger.error('couldn\'t update lick count in db\n' + err.stack)
            }
        }
    }

    /**
     * GET /api/lick/{id}
     *
     * Get a lick by id.
     */
    public static async getLick(ctx: Context): Promise<void> {

        const lick: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lick) || !LickAssertions.requesterCanAccessLick(ctx, lick)) { return; }

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

        const lick: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lick) || !LickAssertions.requesterCanAccessLick(ctx, lick)) { return; }

        try {
            ctx.status = StatusCodes.OK;
            const readFile = util.promisify(fs.readFile);
            ctx.body = await readFile(lick.audioFileLocation);
        } catch (err) {
            logger.error('couldn\'t get lick audio from file\n' + err.stack)
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "Error: Could not get lick audio from file."}}
        }
    }

    /**
     * GET /api/lick-count
     *
     * Get the total number of licks in the db.
     */
    public static async getLickCount(ctx: Context): Promise<void> {
        try {
            ctx.status = StatusCodes.OK;
            ctx.body = await LickCountDAO.getLickCountFromDb();
        } catch (err) {
            logger.error('couldn\'t get lick count\n' + err.stack)
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

        const lickToUpdate: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToUpdate) || !LickAssertions.requesterIsLickOwner(ctx, lickToUpdate)) {
            return;
        }

        const userToUpdate: User | undefined  = await LickAssertions.getUserByEmailOrErrorResponse(ctx);
        if (userToUpdate === undefined || !await LickAssertions.userIsNotRequester(ctx, userToUpdate)) { return; }

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

        await LickAssertions.lickSaved(ctx, lickToUpdate)
    }

    /**
     * PUT /api/lick/unfollow/{id}
     *
     * Removes the authenticated user from the list of users the lick is shared with
     */
    public static async unfollowLick(ctx: Context): Promise<void> {

        const lickToUnfollow: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToUnfollow)) { return; }

        // works if lick was never shared with auth user in the first place
        const authUserId = ctx.state.user.id;
        lickToUnfollow.sharedWith =
            lickToUnfollow.sharedWith.filter((user) => user.id !== authUserId);

        await LickAssertions.lickSaved(ctx, lickToUnfollow)
    }

    /**
     * PUT /api/lick/{id}
     *
     * Update a lick by id.
     */
    public static async updateLick(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToUpdate) || !LickAssertions.requesterIsLickOwner(ctx, lickToUpdate)) { return; }

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

        if (!await LickAssertions.isValid(ctx, lickToUpdate)) { return; }

        await LickAssertions.lickSaved(ctx, lickToUpdate);
    }

    /**
     * PUT /api/lick/update-tab/{id}
     *
     * Update a licks tab after a user has manually edited it.
     */
    public static async updateTab(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToUpdate) ||  !LickAssertions.requesterIsLickOwner(ctx, lickToUpdate)) { return; }

        const body = ctx.request.body;
        if (body.tab !== undefined) {
            lickToUpdate.tab = body.tab;
        }

        await LickAssertions.lickSaved(ctx, lickToUpdate);
    }

    /**
     * PUT /api/licks/re-tab/{id}
     *
     * Re-Tab a lick given a new tuning and / or capo
     */
    public static async reTabLick(ctx: Context): Promise<void> {

        const lickToUpdate: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToUpdate) ||  !LickAssertions.requesterIsLickOwner(ctx, lickToUpdate)) { return; }

        const body = ctx.request.body;
        if (lickToUpdate.tuning === body.tuning && lickToUpdate.capo === body.capo) {
            // no work to do
            ctx.status = StatusCodes.OK;
            ctx.body = lickToUpdate;
            return;
        }

        lickToUpdate.tuning = body.tuning;
        lickToUpdate.capo = body.capo;

        if (!await LickAssertions.isValid(ctx, lickToUpdate)) { return; }
        if (!await LickAssertions.tabbedSuccessfully(ctx, lickToUpdate)) { return; }

        await LickAssertions.lickSaved(ctx, lickToUpdate);
    }

    /**
     * DELETE /api/lick/{id}
     *
     * Delete a lick by id.
     */
    public static async deleteLick(ctx: Context): Promise<void> {

        const lickToRemove: Lick | undefined = await LickDAO.getLickFromDbById(+ctx.params.id || 0);

        if (!LickAssertions.doesExist(ctx, lickToRemove) ||  !LickAssertions.requesterIsLickOwner(ctx, lickToRemove)) { return; }

        try {
            await LickUtils.unlinkAsync(lickToRemove.audioFileLocation);
        } catch (err) {
            // ENOENT == file doesn't exist, let that case fail silently
            if (err.code !== 'ENOENT') {
                logger.error('couldn\'t delete file\n' + err.stack)
                ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
                ctx.body = { errors: {error: "Error: Cant unlink lick from file system."}}
                return
            }
        }

        await LickAssertions.lickRemoved(ctx, lickToRemove);
    }
}
