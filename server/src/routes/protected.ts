import Router from "koa-router";

import { LickController } from "../controller/lick";
import { UserController } from "../controller/user";
import { isAuthenticated } from "../middleware/auth-validator";

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")
protectedRouter.use(isAuthenticated);

protectedRouter.get("/user", UserController.getAuthUser);
protectedRouter.get("/user/licks", UserController.getAuthUserLicks);
protectedRouter.get("/user/licks-shared-with-me", UserController.getLicksSharedWithAuthUser);
protectedRouter.delete("/user", UserController.deleteAuthUser);
protectedRouter.get("/users", UserController.getUsers);
protectedRouter.get("/users/:id", UserController.getUser);
protectedRouter.put("/users/:id", UserController.updateUser);

protectedRouter.post("/licks", LickController.createLick);
protectedRouter.put("/lick/share/:id", LickController.shareLick);
protectedRouter.put("/lick/unshare/:id", LickController.unshareLick);
protectedRouter.put("/lick/unfollow/:id", LickController.unfollowLick);
protectedRouter.put("/licks/:id", LickController.updateLick);
protectedRouter.delete("/licks/:id", LickController.deleteLick);

export { protectedRouter };