import { Context } from "koa";
import { TokenPayload } from "google-auth-library";
import { StatusCodes } from "http-status-codes";

import { User } from "../entity/user";
const logger = require('../winston/winston');
import {
    getUserByEmail,
    saveUserToDb,
    getUserById
} from "../dao/user";

export class UserController {

    // Called in middleware every request
    public static async getOrCreateUser(payload: TokenPayload): Promise<User> {

        let user: User | undefined = await getUserByEmail(payload.email);

        // create user if doesn't exist
        if (!user) {
            user = new User();
            user.email = payload.email;
            user.name = payload.name;
            user.picture_URL = payload.picture;
            user.given_name = payload.given_name;
            user.family_name = payload.family_name;

            try {
                user = await saveUserToDb(user);
            } catch (err) {
                // Most likely error case to be caught here is when the jwt token provided
                // does not provide information required by the user entity, such as
                // email, given_name, or family_name
                logger.error('couldn\'t create new user in db\n' + err.stack)
                return null;
            }
        }
        return user;
    }

    /**
     * GET /api/user/licks
     *
     * Get all auth users licks by user id.
     */
    public static async getAuthUserLicks(ctx: Context): Promise<void> {

        try {
            // should return the currently authenticated user
            let authUser: User | undefined = await getUserById(ctx.state.user.id);

            if (!authUser) { throw new Error('auth user not found in db'); }
            ctx.status = StatusCodes.OK;
            ctx.body = authUser.licks;
        } catch (err) {
            logger.error('couldn\'t get auth users licks from db\n' + err.stack)
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "We could not get your licks right now"}}
        }
    }

    /**
     * GET /api/user/licks-shared-with-me
     *
     * Get all licks shared with the auth user by user id.
     */
    public static async getLicksSharedWithAuthUser(ctx: Context): Promise<void> {

        try {
            // should return the currently authenticated user
            let authUser: User | undefined = await getUserById(ctx.state.user.id);

            if (!authUser) { throw new Error('auth user not found in db'); }
            ctx.status = StatusCodes.OK;
            ctx.body = authUser.sharedWithMe || [];
        } catch (err) {
            logger.error('couldn\'t get licks shared with auth user from db\n' + err.stack)
            ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
            ctx.body = { errors: {error: "We could not get the licks shared with you right now"}}
        }
    }
}
