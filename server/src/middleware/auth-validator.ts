import OAuth2Controller from "../controller/oauth2";
import {User} from "../entity/user";

export const authValidator = async (ctx, next) => {
    const idToken = ctx.cookies.get("ti");
    if (!idToken) {
        ctx.state.isAuthenticated = false;
    } else {
        const ticket = await OAuth2Controller.verifyToken(idToken);
        if (ticket) {
            const user: User = await OAuth2Controller.getOrCreateUser(ticket.payload);
            if (user) {
                ctx.state.user = user;
                ctx.state.isAuthenticated = true;
            } else {
                ctx.isAuthenticated = false;
            }
        } else {
            ctx.state.isAuthenticated = false;
        }
    }
    await next();
}
