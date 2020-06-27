import Router from "koa-router";

import { LickController } from "../controller/lick";
import { UserController } from "../controller/user";
import { isAuthenticated } from "../middleware/auth-validator";

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")
protectedRouter.use(isAuthenticated);

// User routes
protectedRouter.get("/user", UserController.getAuthenticatedUser);
protectedRouter.delete("/user", UserController.deleteAuthenticatedUser);
protectedRouter.get("/users", UserController.getUsers);
protectedRouter.get("/users/:id", UserController.getUser);
protectedRouter.put("/users/:id", UserController.updateUser);

// Lick routes
protectedRouter.post("/licks", LickController.createLick);
protectedRouter.put("/licks/:id", LickController.updateLick);
protectedRouter.delete("/licks/:id", LickController.deleteLick);

export { protectedRouter };