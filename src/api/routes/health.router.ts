import Router from "@koa/router";
import { Context, Next } from "koa";


const healthRouter: Router = new Router();

healthRouter.get("/health", async (ctx: Context, next: Next): Promise<void> => {
    await next();

    ctx.response.body = {
        status: "success"
    };
});

export default healthRouter;