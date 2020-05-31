import Koa from "koa"
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import logger from 'koa-logger'

import { unprotectedRouter } from "./routes/unprotected";
import { protectedRouter } from "./routes/protected";

// do more types of testing then clean this up
export function startApp(): Koa {
    const app: Koa = new Koa()

    // Logs all endpoint requests 
    app.use(logger());

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable bodyParser with default options
    app.use(bodyParser());


    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    // app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

    // something about registering routes here, ie create new routes class

    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());


    // actually cant start the app from inside here, need to do it externally as it breaks tests, will fix later
    // from https://github.com/visionmedia/supertest/issues/568
    // So I had this issue as well.
    // What you want to do is that you don't want to start your server. In your main server express file you should export the server. But do NOT call the listen method.

    // So modify your code so that when you're testing (for example by setting an environment variable and looking for that), you're not calling the listen() method. This should resolve it and let you run your tests in parallel.

    return app
}
