import {Context} from "koa";

/**
 * Hello world!
 */
export async function helloWorldAction(context: Context) {

    context.body = "Hello world!";
}