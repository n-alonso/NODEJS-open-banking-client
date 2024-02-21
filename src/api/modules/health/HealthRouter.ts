import Router from "@koa/router";
import { Context, Next } from "koa";

export class HealthRouter {
    private readonly healthRouter: Router;

    public constructor() {
        this.healthRouter = new Router();

        this.healthRouter.get("/health", async (ctx: Context, next: Next): Promise<void> => {
            await next();

            ctx.response.body = {
                status: "success",
            };
        });
    }

    public getRouter(): Router {
        return this.healthRouter;
    }
}
