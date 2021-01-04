import { Context } from "koa";
import { Lick } from "../entity/lick";
import { StatusCodes } from "http-status-codes";
import { User } from "../entity/user";
import { UserController } from "./user";
import { validate, ValidationError } from "class-validator";
import { LickController } from "./lick";

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
