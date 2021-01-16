import {Context} from "koa";
import { LoginTicket } from "google-auth-library";
import * as googleApis from "googleapis";

import {User} from "../entity/user";
import { UserController } from "./user";

if (!process.env.OAUTH_CLIENT_ID) throw new Error('process.env.OAUTH_CLIENT_ID is not defined')
if (!process.env.OAUTH_CLIENT_SECRET) throw new Error('process.env.OAUTH_CLIENT_SECRET is not defined')
if (!process.env.OAUTH_REDIRECT_URL) throw new Error('process.env.OAUTH_REDIRECT_URL is not defined')

const oauth2Client = new googleApis.google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URL
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

export default class OAuth2Controller {

    /**
     * GET /api/loginUrl
     *
     * Get google cloud endpoint for OAuth2
     */
    public static async loginUrl(ctx: Context): Promise<void> {
        ctx.body = oauth2Client.generateAuthUrl({
            scope: scopes
        });
    }

    /**
     * GET /api/token
     *
     * OAuth2 callback endpoint for accessCode to jwt exchange
     */
    //todo: jwt verification intermediate step
    //todo: make POST operation
    public static async tokenExchange(ctx: Context): Promise<void> {
        const oauthCode = ctx.query["code"];
        const {tokens} = await oauth2Client.getToken(oauthCode);
        OAuth2Controller.setCookies(ctx, tokens);
        const ticket: LoginTicket = await OAuth2Controller.verifyToken(tokens.id_token);
        const user: User = await UserController.getOrCreateUser(ticket.getPayload())
        if (!user) {
            ctx.response.status = 500;
        } else {
            // sent back deconstructed ti ticket
            ctx.body = ticket.getPayload()
        }
    }

    public static async verifyToken(idToken: string): Promise<LoginTicket> {
        try {
            return await oauth2Client.verifyIdToken({
                idToken: idToken,
                audience: process.env.OAUTH_CLIENT_ID
            });
        } catch {
            return null;
        }
    }

    private static setCookies(ctx, tokens) {
        ctx.cookies.set('ta', tokens.access_token);
        ctx.cookies.set('ti', tokens.id_token);
    }
}
