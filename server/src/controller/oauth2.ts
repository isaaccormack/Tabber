import {BaseContext} from "koa";
import {google} from 'googleapis';
import * as jwt from "jsonwebtoken";

// @ts-ignore // typescript can't find this but it works...
import * as keys from "../../keys/keys.json";

const oauth2Client = new google.auth.OAuth2(
    keys.YOUR_CLIENT_ID,
    keys.YOUR_CLIENT_SECRET,
    keys.YOUR_REDIRECT_URL
);
const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

//todo: this whole file needs a lot of improvement
export default class OAuth2Controller {

    /**
     * GET /api/loginUrl
     *
     * Get google cloud endpoint for OAuth2
     */
    public static async loginUrl(ctx: BaseContext): Promise<void> {
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
    public static async tokenExchange(ctx: BaseContext): Promise<void> {
        const oauthCode = ctx.query["code"];
        const {tokens} = await oauth2Client.getToken(oauthCode)
        const id_token: any = jwt.decode(tokens.id_token); //todo: make interface
        OAuth2Controller.setCookies(ctx, tokens);
        ctx.body = id_token.given_name;
    }

    private static setCookies(ctx, tokens) {
        ctx.cookies.set('ta', tokens.access_token);
        ctx.cookies.set('ti', tokens.id_token);
    }

}