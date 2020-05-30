import Router from "koa-router";
import { user } from "../controller";

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")

// User routes
protectedRouter.get("/users", user.getUsers);
protectedRouter.get("/users/:id", user.getUser);
protectedRouter.post("/users", user.createUser);
protectedRouter.put("/users/:id", user.updateUser);
protectedRouter.delete("/users/:id", user.deleteUser);
protectedRouter.delete("/testusers/:id", user.deleteTestUser);

export { protectedRouter };

// this needs to become a class