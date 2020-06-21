import Router from "koa-router";

import { GeneralController } from "../controller/general";
import { LickController } from "../controller/lick";
import OAuth2Controller from "../controller/oauth2";

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")

// Hello World route
unprotectedRouter.get("/helloworld", GeneralController.helloWorld);
unprotectedRouter.get("/loginUrl", OAuth2Controller.loginUrl);
unprotectedRouter.get("/token", OAuth2Controller.tokenExchange);

// Unprotected Lick Routes
unprotectedRouter.get("/licks/:id", LickController.getLick);
unprotectedRouter.get("/licks/audio/:id", LickController.getLickAudio);
// unprotectedRouter.get("/licks/sharedWith/:id", LickController.getUsersLickSharedWith);


export { unprotectedRouter };