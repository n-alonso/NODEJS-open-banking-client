import Router from "@koa/router";
import { Context, Next } from "koa";
import { CrudRepository } from "../interfaces/CrudRepository.interface";
import { User } from "./UserEntity.interface";
import { IoCContainer } from "../../core/IoCContainer";

export class UserRouter {
    private readonly userRepository: CrudRepository<User>;
    private readonly userRouter: Router;

    public constructor() {
        this.userRepository = IoCContainer.getInstance().resolve("UserRepository");
        this.userRouter = new Router();

        this.userRouter.get("/users", async (ctx: Context, next: Next): Promise<void> => {
            await next();

            ctx.response.body = { message: "users endpoint" };

            try {
                const users: User[] = await this.userRepository.find();
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
