import OAuth2Controller from "../controller/oauth2";
import {User} from "../entity/user";

export const authValidator = async (ctx, next) => {
    const idToken = ctx.cookies.get("ti");
    ctx.state.isAuthenticated = false;
    if (idToken) {
        const ticket = await OAuth2Controller.verifyToken(idToken);
        if (ticket) {
            const user: User = await OAuth2Controller.getOrCreateUser(ticket.payload);
            if (user) {
                ctx.state.user = user;
                ctx.state.isAuthenticated = true;
            }
        }
    }
    await next();
}
