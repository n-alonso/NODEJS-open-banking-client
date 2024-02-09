import Router from "@koa/router";
import { Context, Next } from "koa";


const homeRouter: Router = new Router();

homeRouter.get("/", async (ctx: Context, next: Next): Promise<void> => {
    await next();

    ctx.response.body = {
        message: "Hello Koa"
    };
});

export default homeRouter;