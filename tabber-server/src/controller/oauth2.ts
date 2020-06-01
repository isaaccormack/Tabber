import {BaseContext} from "koa";
import {google} from 'googleapis';
import jwtDecoder from 'jwt-decode';

// @ts-ignore // typescript can't find this but it works...
import * as keys from "../../keys/keys.json";

export default class OAuth2Controller {

    private static oauth2Client = new google.auth.OAuth2(
        keys.YOUR_CLIENT_ID,
        keys.YOUR_CLIENT_SECRET,
        keys.YOUR_REDIRECT_URL
    );


    public static async loginUrl(ctx: BaseContext): Promise<void> {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];
        const url = OAuth2Controller.oauth2Client.generateAuthUrl({
            scope: scopes
        });
        ctx.body = url;
    }

    public static async tokenExchange(ctx: BaseContext): Promise<void> {
        const oauthCode = ctx.query["code"];
        const {tokens} = await OAuth2Controller.oauth2Client.getToken(oauthCode)
        const jwt: any = jwtDecoder(tokens.id_token); //todo: make interface
        OAuth2Controller.setCookies(ctx, tokens);
        ctx.body = jwt.given_name;
    }

    private static setCookies(ctx, tokens) {
        ctx.cookies.set('ta', tokens.access_token);
        ctx.cookies.set('ti', tokens.id_token);
    }

}