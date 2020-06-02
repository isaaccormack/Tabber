import Router from "koa-router";
import { UserController } from "../controller/user";

const protectedRouter: Router = new Router();

async function isAuthenticated(ctx, next) {
    if (ctx.state.isAuthenticated) {
        await next();
    } else {
        ctx.response.status = 401;
    }
}

protectedRouter.prefix("/api")

// User routes
protectedRouter.get("/users", isAuthenticated, UserController.getUsers);
protectedRouter.get("/users/:id", isAuthenticated, UserController.getUser);
protectedRouter.post("/users", isAuthenticated, UserController.createUser);
protectedRouter.put("/users/:id", isAuthenticated, UserController.updateUser);
protectedRouter.delete("/users/:id", isAuthenticated, UserController.deleteUser);
protectedRouter.delete("/testusers/:id", isAuthenticated, UserController.deleteTestUser);

export { protectedRouter };