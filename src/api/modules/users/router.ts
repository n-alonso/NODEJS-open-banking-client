import Router from "@koa/router";
import { Context } from "koa";
import { User } from "./models/user-entity";
import { IoCContainer } from "../../../core/ioc-container";
import { UserService } from "./service";
import isAuthenticated from "../../policies/is-authenticated";
import isAdmin from "../../policies/is-admin";
import isSelf from "../../policies/is-self";
import winston from "winston";
import { UserRoles } from "./models/user-roles";
import { Logger } from "../../../libs/logger";
import { Crypto } from "../../../libs/crypto";

export class UserRouter {
    private readonly userService: UserService;
    private readonly userRouter: Router;
    private readonly logger: winston.Logger;
    private readonly crypto: Crypto;

    public constructor() {
        this.userService = IoCContainer.getInstance().resolve("UserService");
        this.logger = new Logger(UserRouter.name).getLogger();
        this.crypto = new Crypto();
        this.userRouter = new Router({ prefix: "/users" });

        this.userRouter.get("/", isAuthenticated, isAdmin, async (ctx: Context): Promise<void> => {
            try {
                const users: User[] = await this.userService.find();
                ctx.response.body = users;
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error fetching users");
            }
        });

        this.userRouter.get("/:id", isAuthenticated, isSelf, async (ctx: Context) => {
            const id: string = ctx.params.id;

            try {
                const user: User = await this.userService.findById(id); //

                const body = {
                    id: user.id,
                    googleid: this.crypto.decrypt(user.googleid),
                    name: user.name && this.crypto.decrypt(user.name),
                    email: user.email && this.crypto.decrypt(user.email),
                    role: user.role,
                };
                ctx.response.body = body;
                return;
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error fetching user");
            }
        });

        this.userRouter.patch("/:id", isAuthenticated, isAdmin, async (ctx: Context) => {
            const id: string = ctx.params.id;
            const role: UserRoles | undefined = (ctx.body as { role?: UserRoles }).role;

            if (!role) ctx.throw(400, "Role is required");

            try {
                const user: User = await this.userService.updateRole(id, role);
                ctx.response.body = { status: "Success", updated: user };
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error updating user");
            }
        });

        this.userRouter.delete("/:id", isAuthenticated, isAdmin, async (ctx: Context) => {
            try {
                const user: User = await this.userService.deleteById(ctx.params.id);
                ctx.response.body = { status: "Success", deleted: user };
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error deleting user");
            }
        });
    }

    public getRouter(): Router {
        return this.userRouter;
    }
}
