import Router from "koa-router";
import { UserController } from "../controller/user";
<<<<<<< HEAD
import {isAuthenticated} from "../middleware/auth-validator";
import { LickController } from "../controller/lick";
=======
import { LickController } from "../controller/lick";
import { isAuthenticated } from "../middleware/auth-validator";
>>>>>>> 52d308a6ac3ded789b61fd19ad543b3a38369cb8

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")
protectedRouter.use(isAuthenticated);

// User routes
protectedRouter.get("/users", UserController.getUsers);
protectedRouter.get("/users/:id", UserController.getUser);
protectedRouter.post("/users", UserController.createUser);
protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/users/:id", UserController.deleteUser);
protectedRouter.delete("/testusers/:id", UserController.deleteTestUser);

// Lick routes
protectedRouter.get("/licks/:id", LickController.getLick);
protectedRouter.get("/licks/audio/:id", LickController.getLickAudio);
protectedRouter.post("/licks", LickController.createLick);
protectedRouter.put("/licks/:id", LickController.updateLick);
protectedRouter.delete("/licks/:id", LickController.deleteLick);

export { protectedRouter };