import {Context} from "koa";
import * as googleApis from "googleapis";
import * as jwt from "jsonwebtoken";

import * as keys from "../../keys/keys.json";
import {User} from "../entity/user";
import {getManager, Repository} from "typeorm";
import { LoginTicket, TokenPayload } from "google-auth-library";


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
        const user: User = await OAuth2Controller.getOrCreateUser(ticket.getPayload())
        if (user === null) {
            ctx.response.status = 500;
        } else {
            ctx.body = user.name;
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

    public static async getOrCreateUser(payload: TokenPayload): Promise<User> {
        const userRepository: Repository<User> = getManager().getRepository(User);
        // get user
        let user: User = await userRepository.findOne(
            {
                where:
                    {email: payload.email}
            }
        );
        // create user is doesn't exist
        if (!user) {
            user = new User();
            user.email = payload.email;
            user.name = payload.given_name;
            try {
                user = await userRepository.save(user);
            } catch {
                return null;
            }
        }
        return user;
    }

    private static setCookies(ctx, tokens) {
        ctx.cookies.set('ta', tokens.access_token);
        ctx.cookies.set('ti', tokens.id_token);
    }

}
