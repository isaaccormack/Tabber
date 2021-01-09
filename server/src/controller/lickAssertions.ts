import { Context } from "koa";
import { Lick } from "../entity/lick";
import { StatusCodes } from "http-status-codes";
import { User } from "../entity/user";
import { UserController } from "./user";
import { validate, ValidationError } from "class-validator";
import { LickController } from "./lick";
import * as audioDuration from "get-audio-duration";
const TabModule = require('../tabbing/tabLick');

export const assertAudioFileValid = (ctx: Context, audioFile: any): boolean  => {
    const err: Error = LickController.validateAudioFile(audioFile);
    if (err) {
        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.body = { errors: {error: err.message}}
        return false
    }

    return true;
}

export const assertLickMetadataValid = async (ctx: Context, lick: Lick): Promise<boolean> => {
    const errors: ValidationError[] = await validate(lick);

    if (errors.length > 0) {
        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.body = { errors };
        return false;
    }

    return true;
}

export const assertLickAudioSaved =  async(ctx: Context, lick: Lick, audioFile: any): Promise<boolean> => {
    try {
        lick.audioFileLocation = await LickController.saveAudioFile(audioFile);
    } catch (err) {
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
        ctx.body = { errors: {error: err.message}}
        return false
    }

    return true;
}

export const assertLickAudioLengthValid = async(ctx: Context, lick: Lick): Promise<boolean> => {
    try {
        lick.audioLength = await audioDuration.getAudioDurationInSeconds(lick.audioFileLocation)
    } catch (err) {
        await LickController.attemptToDeleteFile(lick.audioFileLocation);
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
        ctx.body = { errors: {error: "Error: Cant get length of audio file."}}
        return false;
    }

    const maxLickLength = 30;
    if (lick.audioLength > maxLickLength) { // lick is too long
        await LickController.attemptToDeleteFile(lick.audioFileLocation);
        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.body = { errors: {error: "Error: Audio file is longer than " + maxLickLength + " seconds."}}
    return false;
    }

    return true;
}

export const assertLickTabbed = async(ctx: Context, lick: Lick): Promise<boolean> => {
    try {
        // Generate tab for lick after other data is handled
        lick.tab = await TabModule.tabLick(lick.audioFileLocation, lick.tuning, lick.capo);
    } catch (err) {
        console.error(err);
        await LickController.attemptToDeleteFile(lick.audioFileLocation);
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
        ctx.body = { errors: {error: "Error: Failed to tab audio file."}};
        return;
    }

    return true;
}

export const assertLickExists = (ctx: Context, lick: Lick | undefined): boolean => {
  if (lick) { return true; }

  ctx.status = StatusCodes.BAD_REQUEST;
  ctx.body = { errors: {error: "Error: The lick you are trying to retrieve doesn't exist."}}
  return false;
}

export const assertRequesterCanAccessLick = (ctx: Context, lick: Lick | undefined): boolean => {
    if (LickController.canUserAccess(ctx.state.user, lick)) { return true; }

    ctx.status = StatusCodes.FORBIDDEN;
    ctx.body = { errors: {error: "Error: You do not have permission to access this lick."}}
    return false;
}

export const assertRequesterIsLickOwner = (ctx: Context, lick: Lick | undefined): boolean => {
    if (ctx.state.user.id === lick.owner.id) { return true; }

    ctx.status = StatusCodes.FORBIDDEN;
    // TODO: maybe change this error message to Error: A lick can only be edited by its owner
    ctx.body = { errors: {error: "Error: You do not have permission to edit this lick."}}
    return false;
}

export const getUserByEmailOrErrorResponse = async (ctx: Context): Promise<User | undefined> => {
    const userByEmail: User | undefined = await UserController.getUserByEmail(ctx.request.body.userEmail || "");

    if (userByEmail) { return userByEmail; }

    ctx.status = StatusCodes.PRECONDITION_FAILED;
    ctx.body = { errors: {error: "Error: The user you are trying to (un)share with doesn't exist in the db"}}
    return undefined;
}

// export const assertUserExists = async (ctx: Context): Promise<User | undefined> => {
//     const userByEmail: User | undefined = await UserController.getUserByEmail(ctx.request.body.userEmail || "");
//     const userById: User | undefined = await UserController.getUserByID(+ctx.request.body.userID || 0);
//
//     if (userByEmail) { return userByEmail; }
//     if (userById) { return userById; }
//
//     ctx.status = StatusCodes.BAD_REQUEST;
//     ctx.body = { errors: {error: "Error: The user you are trying to (un)share with doesn't exist in the db"}}
//     return undefined;
// }

export const assertUserIsNotRequester = async (ctx: Context, user: User): Promise<boolean> => {
    if (user.id === ctx.state.user.id) {
        ctx.status = StatusCodes.IM_A_TEAPOT; // funny response code for a funny case
        ctx.body = { errors: {error: "Error: Cannot (un)share a lick with yourself."}}
        return false;
    }

    return true;
}

export const assertLickValid = async (ctx: Context, lick: Lick | undefined): Promise<boolean> => {
    const errors: ValidationError[] = await validate(lick);

    if (errors.length > 0) {
        ctx.status = StatusCodes.BAD_REQUEST;
        ctx.body = { errors };
        return false;
    }

    return true;
}
