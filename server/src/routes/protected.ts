import Router from "koa-router";

import { LickController } from "../controller/lick";
import { UserController } from "../controller/user";
import { isAuthenticated } from "../middleware/auth-validator";

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")
protectedRouter.use(isAuthenticated);

protectedRouter.get("/user/licks", UserController.getAuthUserLicks);
protectedRouter.get("/user/licks-shared-with-me", UserController.getLicksSharedWithAuthUser);

protectedRouter.put("/lick/update-shared-with/:id", LickController.updateLickSharedWith);
protectedRouter.put("/lick/unfollow/:id", LickController.unfollowLick);
protectedRouter.put("/lick/:id", LickController.updateLick);
protectedRouter.put("/lick/re-tab/:id", LickController.reTabLick);
protectedRouter.put("/lick/update-tab/:id", LickController.updateTab);
protectedRouter.delete("/lick/:id", LickController.deleteLick);

export { protectedRouter };
