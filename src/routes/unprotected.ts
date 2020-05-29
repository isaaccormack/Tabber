import Router from "koa-router";
import { general } from "../controller";

// this becomes a little class with its own methods for routes and db etc.

const unprotectedRouter: Router = new Router();

// Hello World route
unprotectedRouter.get("/", general.helloWorld);

export { unprotectedRouter };