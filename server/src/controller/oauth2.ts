import {BaseContext} from "koa";
import {google} from 'googleapis';
import * as jwt from "jsonwebtoken";

// @ts-ignore // typescript can't find this but it works...
import * as keys from "../../keys/keys.json";
import {User} from "../entity/user";
import {getManager, Repository} from "typeorm";


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
        OAuth2Controller.setCookies(ctx, tokens);
        const ticket = await OAuth2Controller.verifyToken(tokens.id_token);
        const user: User = await OAuth2Controller.getOrCreateUser(ticket.payload)
        ctx.body = user.name;
    }

    public static async verifyToken(idToken: string): Promise<any> {
        try {
            return await oauth2Client.verifyIdToken({
                idToken: idToken,
                audience: keys.YOUR_CLIENT_ID
            });
        } catch {
            return null;
        }
    }

    public static async getOrCreateUser(payload: any): Promise<User> {
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
            user = await userRepository.save(user);
        }
        return user;
    }

    private static setCookies(ctx, tokens) {
        ctx.cookies.set('ta', tokens.access_token);
        ctx.cookies.set('ti', tokens.id_token);
    }

}