import Router from "koa-router";
import { general, oauth2 } from "../controller";

// this becomes a little class with its own methods for routes and db etc.

const unprotectedRouter: Router = new Router();

// Hello World route
unprotectedRouter.get("/api/helloworld", general.helloWorld);
unprotectedRouter.get("/api/loginUrl", oauth2.loginUrl);
unprotectedRouter.get("/api/token", oauth2.tokenExchange);

export { unprotectedRouter };