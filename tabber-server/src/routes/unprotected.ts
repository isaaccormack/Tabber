import Router from "koa-router";
import { general,  } from "../controller";
import OAuth2Controller from "../controller/oauth2";

// this becomes a little class with its own methods for routes and db etc.

const unprotectedRouter: Router = new Router();

// Hello World route
unprotectedRouter.get("/api/helloworld", general.helloWorld);
unprotectedRouter.get("/api/loginUrl", OAuth2Controller.loginUrl);
unprotectedRouter.get("/api/token", OAuth2Controller.tokenExchange);

export { unprotectedRouter };