import { Context } from "koa";
import { StatusCodes } from "http-status-codes";
import { validate, ValidationError } from "class-validator";
import * as audioDuration from "get-audio-duration";

import { Lick } from "../entity/lick";
import { User } from "../entity/user";
import { UserDAO } from "../dao/user";
import { LickUtils } from "./lickUtils";
import { LickDAO } from "../dao/lick";

const logger = require('../winston/winston');
const TabModule = require('../tabbing/tabLick');

export class LickAssertions {

    public static audioFileValid(ctx: Context, audioFile: any): boolean {
        try {
            LickUtils.validateAudioFile(audioFile);
            return true;
        } catch (err) {
            ctx.status = StatusCodes.BAD_REQUEST;
            ctx.body = {errors: {error: err.message}}
            return false
        }
    }

    public static async metadataValid(ctx: Context, lick: Lick): Promise<boolean> {
        const errors: ValidationError[] = await validate(lick);

        if (errors.length > 0) {
            ctx.status = StatusCodes.BAD_REQUEST;
            ctx.body = {errors};
            return false;
        }

        return true;
    }

    public static async audioFileSaved(ctx: Context, lick: Lick, audioFile: any): Promise<boolean> {
        try {
            lick.audioFileLocation = await LickUtils.saveAudioFile(audioFile);
            return true;
        } catch (err) {
            logger.error('couldn\'t get save audio file\n' + err.stack)
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = {errors: {error: err.message}}
            return false
        }
    }

    public static async audioLengthValid(ctx: Context, lick: Lick): Promise<boolean> {
        try {
            lick.audioLength = await audioDuration.getAudioDurationInSeconds(lick.audioFileLocation)
        } catch (err) {
            logger.error('couldn\'t get audio duration of file\n' + err.stack)
            await LickUtils.attemptToDeleteFile(lick.audioFileLocation);
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = {errors: {error: "Error: Cant get length of audio file."}}
            return false;
        }

        const MAX_AUDIO_LENGTH = 15; // seconds
        if (lick.audioLength > MAX_AUDIO_LENGTH) {
            await LickUtils.attemptToDeleteFile(lick.audioFileLocation);
            ctx.status = StatusCodes.BAD_REQUEST;
            ctx.body = {errors: {error: "Error: Audio file is longer than " + MAX_AUDIO_LENGTH + " seconds."}}
            return false;
        }

        return true;
    }

    public static async tabbedSuccessfully(ctx: Context, lick: Lick): Promise<boolean> {
        try {
            // Generate tab for lick after other data is handled
            lick.tab = await TabModule.tabLick(lick.audioFileLocation, lick.tuning, lick.capo);
            return true;
        } catch (err) {
            logger.error('couldn\'t tab lick\n' + err.stack)
            await LickUtils.attemptToDeleteFile(lick.audioFileLocation);
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = {errors: {error: "Error: Failed to tab audio file."}};
            return;
        }
    }

    public static doesExist(ctx: Context, lick: Lick | undefined): boolean {
        if (lick) {
            return true;
        }

        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.body = {errors: {error: "Error: The lick you are trying to retrieve doesn't exist."}}
        return false;
    }

    public static requesterCanAccessLick(ctx: Context, lick: Lick | undefined): boolean {
        if (LickUtils.canUserAccess(ctx.state.user, lick)) {
            return true;
        }

        ctx.status = StatusCodes.FORBIDDEN;
        ctx.body = {errors: {error: "Error: You do not have permission to access this lick."}}
        return false;
    }

    public static requesterIsLickOwner(ctx: Context, lick: Lick | undefined): boolean {
        if (ctx.state.user.id === lick.owner.id) {
            return true;
        }

        ctx.status = StatusCodes.FORBIDDEN;
        // TODO: maybe change this error message to Error: A lick can only be edited by its owner
        ctx.body = {errors: {error: "Error: You do not have permission to edit this lick."}}
        return false;
    }

    public static async getUserByEmailOrErrorResponse(ctx: Context): Promise<User | undefined> {
        const userByEmail: User | undefined = await UserDAO.getUserByEmail(ctx.request.body.userEmail || "");

        if (userByEmail) {
            return userByEmail;
        }

        ctx.status = StatusCodes.PRECONDITION_FAILED;
        ctx.body = {errors: {error: "Error: The user you are trying to (un)share with doesn't exist in the db"}}
        return undefined;
    }

    public static async userIsNotRequester(ctx: Context, user: User): Promise<boolean> {
        if (user.id === ctx.state.user.id) {
            ctx.status = StatusCodes.IM_A_TEAPOT; // funny response code for a funny case
            ctx.body = {errors: {error: "Error: Cannot (un)share a lick with yourself."}}
            return false;
        }

        return true;
    }

    public static async isValid(ctx: Context, lick: Lick | undefined): Promise<boolean> {
        const errors: ValidationError[] = await validate(lick);

        if (errors.length > 0) {
            ctx.status = StatusCodes.BAD_REQUEST;
            ctx.body = {errors};
            return false;
        }

        return true;
    }

    public static async lickSaved(ctx: Context, lick: Lick): Promise<boolean> {
        try {
            const updatedLick: Lick = await LickDAO.saveLickToDb(lick);

            ctx.status = StatusCodes.OK;
            ctx.body = updatedLick;
            return true;
        } catch (err) {
            logger.error('couldn\'t update lick in db\n' + err.stack)
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "Error: Could not update lick in db"}}
            return false;
        }
    }

    public static async lickRemoved(ctx: Context, lick: Lick) {
        try {
            const removedLick: Lick = await LickDAO.deleteLickFromDb(lick);

            ctx.status = StatusCodes.OK;
            ctx.body = removedLick;
        } catch (err) {
            logger.error('couldn\'t remove lick ' + lick.id + 'from db')
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "Error: Cant remove lick from database."}}
        }
    }
}

