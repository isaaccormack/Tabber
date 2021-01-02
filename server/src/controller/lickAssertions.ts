import { Context } from "koa";
import { Lick } from "../entity/lick";
import { StatusCodes } from "http-status-codes";

export const assertLickExists = (ctx: Context, lick: Lick | undefined): boolean => {
  if (lick) { return true; }

  ctx.status = StatusCodes.BAD_REQUEST;
  ctx.body = { errors: {error: "Error: The lick you are trying to retrieve doesn't exist."}}
  return false;
}
