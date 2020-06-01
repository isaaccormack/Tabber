import { Context } from "koa";

export default interface IUserController {
  getUsers(ctx: Context): Promise<void>;
  getUser(ctx: Context): Promise<void>;
  createUser(ctx: Context): Promise<void>;
  updateUser(ctx: Context): Promise<void>;
  deleteUser(ctx: Context): Promise<void>;
  deleteTestUsers(ctx: Context): Promise<void>;
}