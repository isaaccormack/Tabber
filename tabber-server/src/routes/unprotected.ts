import Router from "koa-router";
import { general, oauth2 } from "../controller";
import {protectedRouter} from "./protected";

// this becomes a little class with its own methods for routes and db etc.

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")
// Hello World route
unprotectedRouter.get("/helloworld", general.helloWorld);
unprotectedRouter.get("/loginUrl", oauth2.loginUrl);
unprotectedRouter.get("/token", oauth2.tokenExchange);

export { unprotectedRouter };