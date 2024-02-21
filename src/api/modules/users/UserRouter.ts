import Router from "@koa/router";
import { Context, Next } from "koa";
import { User } from "./UserEntity.interface";
import { IoCContainer } from "../../../core/IoCContainer";
import { UserService } from "./UserService";

export class UserRouter {
    private readonly userService: UserService;
    private readonly userRouter: Router;

    public constructor() {
        this.userService = IoCContainer.getInstance().resolve("UserService");
        this.userRouter = new Router();

        this.userRouter.get("/users", async (ctx: Context, next: Next): Promise<void> => {
            await next();

            ctx.response.body = { message: "users endpoint" };

            try {
                const users: User[] = await this.userService.find();
                ctx.response.body = users;
            } catch (err: unknown) {
                ctx.response.body = err;
            }
        });
    }

    public getRouter(): Router {
        return this.userRouter;
    }
}
