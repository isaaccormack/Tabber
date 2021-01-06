import Router from "koa-router";

import { LickController } from "../controller/lick";
import OAuth2Controller from "../controller/oauth2";
import { protectedRouter } from "./protected";

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")

unprotectedRouter.get("/loginUrl", OAuth2Controller.loginUrl);
unprotectedRouter.get("/token", OAuth2Controller.tokenExchange);

unprotectedRouter.get("/licks/:id", LickController.getLick);
unprotectedRouter.get("/licks/audio/:id", LickController.getLickAudio);

unprotectedRouter.post("/tab-lick", LickController.tabLick);


export { unprotectedRouter };
