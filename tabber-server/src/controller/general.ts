import { BaseContext } from "koa";

export default class GeneralController {

    /**
     * GET /
     * 
     * Welcome page.
     * A simple welcome message to verify the service is up and running.
     */
    public static async helloWorld(ctx: BaseContext): Promise<void> {
        ctx.body = "Hello World!";
    }

}