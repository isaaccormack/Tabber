import Router from "koa-router";
import { GeneralController } from "../controller/general";
import {protectedRouter} from "./protected";

const unprotectedRouter: Router = new Router();

unprotectedRouter.prefix("/api")
// Hello World route
unprotectedRouter.get("/helloworld", GeneralController.helloWorld);

export { unprotectedRouter };