import Router from "koa-router";
import { GeneralController } from "../controller/general";
import OAuth2Controller from "../controller/oauth2";

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")
// Hello World route
unprotectedRouter.get("/helloworld", GeneralController.helloWorld);
unprotectedRouter.get("/loginUrl", OAuth2Controller.loginUrl);
unprotectedRouter.get("/token", OAuth2Controller.tokenExchange);

export { unprotectedRouter };