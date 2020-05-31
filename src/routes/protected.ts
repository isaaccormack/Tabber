import Router from "koa-router";
import { UserController } from "../controller/user";

const protectedRouter: Router = new Router();

protectedRouter.prefix("/api")

// User routes
protectedRouter.get("/users", UserController.getUsers);
protectedRouter.get("/users/:id", UserController.getUser);
protectedRouter.post("/users", UserController.createUser);
protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/users/:id", UserController.deleteUser);
protectedRouter.delete("/testusers/:id", UserController.deleteTestUser);

export { protectedRouter };