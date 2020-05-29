import Koa from "koa"
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import logger from 'koa-logger'
import {createConnection, Connection} from "typeorm";

import * as dbModule from "../src/database/dbclient";
import { unprotectedRouter } from "./routes/unprotected";
import { protectedRouter } from "./routes/protected";
import UserController from "./controller/user";
import IUserController from "./controller/iuser";
import { connect } from "net";


// export default class Server {

//   public app: Koa;
//   private db: Connection;

//   public static bootstrap(): Server {
//     return new Server();
//   }

//   constructor() {
//     this.app = new Koa();

//     this.config();

//     this.connectDB();

//     this.routes();
//   }

//   private config() {
//       // Logs all endpoint requests 
//       this.app.use(logger());

//       // Provides important security headers to make your app more secure
//       this.app.use(helmet());

//       // Enable bodyParser with default options
//       this.app.use(bodyParser());
//   }

//   private connectDB(): void {
//     // create connection with database
//     // note that its not active database connection
//     // TypeORM creates you connection pull to uses connections from pull on your requests
//     createConnection().then(async () => {      

//       let port: number = +(process.env.PORT) || 3000
//       app.listen(port);

//       console.log(`Server running on port ${port}`);

//     }).catch((error: string) => console.log("TypeORM connection error: ", error));

//   }

//   private static routes() {

//       // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//       this.app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

//       // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
//       // do not protect swagger-json and swagger-html endpoints
//       // app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

//       // something about registering routes here, ie create new routes class

//       // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//       this.app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
//   }


//   pubilc static listen() {

//   }
// }

// fix this later by making the createConnection call async
// let server

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
// createConnection().then(async () => {   
  
//   const app: Koa = new Koa()


//   // Logs all endpoint requests 
//   app.use(logger());

//   // Provides important security headers to make your app more secure
//   app.use(helmet());

//   // Enable bodyParser with default options
//   app.use(bodyParser());


//   // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//   app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

//   // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
//   // do not protect swagger-json and swagger-html endpoints
//   // app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

//   // something about registering routes here, ie create new routes class

//   // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//   app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

//   let port: number = +(process.env.PORT) || 3000
//   server = app.listen(port);

//   console.log(`Server running on port ${port}`);

// }).catch((error: string) => console.log("TypeORM connection error: ", error));

// const app = new Koa();

// app.use(logger());
// app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());


// const port = process.env.PORT || 3000;

// const server = app.listen(port, () => {
//   console.log(`Server is running on ${port}.`);
// });


// index must maintain state of just on database ie. if db is already initialized and 

// export default class Server() {

// }

export function startApp(): any {
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

  /* Get port from environment and listen. */
  var port: number = +(process.env.PORT || "3000");
  const server = app.listen(port);
  console.log("Listening on port " + port);

  return server
}





// async function getServer() {
//   return new Promise((resolve, reject) => {
//     createConnection().then(async () => {

//       const app: Koa = new Koa()


//       // Logs all endpoint requests 
//       app.use(logger());
    
//       // Provides important security headers to make your app more secure
//       app.use(helmet());
    
//       // Enable bodyParser with default options
//       app.use(bodyParser());
    
    
//       // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//       app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());
    
//       // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
//       // do not protect swagger-json and swagger-html endpoints
//       // app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));
    
//       // something about registering routes here, ie create new routes class
    
//       // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
//       app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());
    
//       let port: number = +(process.env.PORT) || 3000
//       const server = app.listen(port);
    
//       console.log(`Server running on port ${port}`);

//       resolve(server)
//     }).catch((err) => reject(err))
//   })
// }


// module.exports = {
//   server: async () => {
//     let res = await getServer();
//     console.log("res is: " + res)
//     return res;
//   }
// }
