import {Context} from "koa";
import * as googleApis from "googleapis";

import * as keys from "../../keys/keys.json";
import {User} from "../entity/user";
import { LoginTicket } from "google-auth-library";
import { UserController } from "./user";


const oauth2Client = new googleApis.google.auth.OAuth2(
    keys.YOUR_CLIENT_ID,
    keys.YOUR_CLIENT_SECRET,
    keys.YOUR_REDIRECT_URL
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
                audience: keys.YOUR_CLIENT_ID
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
