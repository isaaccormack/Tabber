import Router from "koa-router";

import { LickController } from "../controller/lick";
import OAuth2Controller from "../controller/oauth2";

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")

unprotectedRouter.get("/loginUrl", OAuth2Controller.loginUrl);
unprotectedRouter.get("/token", OAuth2Controller.tokenExchange);

unprotectedRouter.post("/lick", LickController.createLick);
unprotectedRouter.get("/lick/:id", LickController.getLick);
unprotectedRouter.get("/lick/audio/:id", LickController.getLickAudio);

export { unprotectedRouter };
