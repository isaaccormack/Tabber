import OAuth2Controller from "../controller/oauth2";
import {User} from "../entity/user";
import { LoginTicket } from "google-auth-library";
import {Context} from "koa";

export const authValidator = async (ctx: Context, next: Function) => {
    const idToken = ctx.cookies.get("ti");
    ctx.state.isAuthenticated = false;
    if (idToken) {
        const ticket: LoginTicket = await OAuth2Controller.verifyToken(idToken);
        if (ticket) {
            const user: User = await OAuth2Controller.getOrCreateUser(ticket.getPayload());
            if (user) {
                ctx.state.user = user;
                ctx.state.isAuthenticated = true;
            }
        }
    }
    await next();
}

export async function isAuthenticated(ctx: Context, next: Function) {
    if (ctx.state.isAuthenticated) {
        await next();
    } else {
        ctx.response.status = 401;
    }
}