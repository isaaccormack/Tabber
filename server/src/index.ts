import * as fs from "fs";
import Koa from "koa"
import bodyParser from "koa-bodyparser";
import formidable from "koa2-formidable"
import helmet from "koa-helmet";
import logger from "koa-logger";
import Router from "koa-router";
import serve from "koa-static";
import * as path from "path";

import { unprotectedRouter } from "./routes/unprotected";
import { protectedRouter } from "./routes/protected";
import { authValidator } from "./middleware/auth-validator";

export function startApp(): Koa {
    const app: Koa = new Koa()
    const router: Router = new Router();

    // Logs all endpoint requests 
    app.use(logger());

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable multipart/form-data style uploads for files
    app.use(formidable({}))

    // Enable bodyParser with default options
    app.use(bodyParser());

    // Middleware to parse jwt token and initialize ctx.state
    app.use(authValidator); // must run this before unprotected routes as ctx.state.user must be accessed in some routes

    // These routes do NOT require the user to be authenticated
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // These routes require the user to be authenticated
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    router.get('/api/*', async(ctx) => {
        ctx.response.status = 404;
    });

    // Distribute views if no api routes are matched
    app.use(serve("./views/build"));

    // Catch all to return react app
    router.get('*', async (ctx,err) => {
        const html = fs.readFileSync(path.resolve('./views/build/index.html'));
        ctx.type = 'html';
        ctx.body = html;
    });
    app.use(router.routes());

    return app
}
