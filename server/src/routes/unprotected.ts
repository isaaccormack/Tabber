import Router from "koa-router";
import { GeneralController } from "../controller/general";

const unprotectedRouter: Router = new Router();

// Hello World route
unprotectedRouter.get("/", GeneralController.helloWorld);

export { unprotectedRouter };