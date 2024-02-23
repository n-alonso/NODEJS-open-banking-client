import Router from "@koa/router";
import { Context } from "koa";
import { User } from "./models/UserEntity.interface";
import { IoCContainer } from "../../../core/IoCContainer";
import { UserService } from "./UserService";
import isAuthenticated from "../../policies/isAuthenticated";
import isAdmin from "../../policies/isAdmin";
import isSelf from "../../policies/isSelf";
import winston from "winston";
import { Logger } from "../../../libs/Logger";
import { UserRoles } from "./models/UserRoles.enum";

export class UserRouter {
    private readonly userService: UserService;
    private readonly userRouter: Router;
    private readonly logger: winston.Logger;

    public constructor() {
        this.userService = IoCContainer.getInstance().resolve("UserService");
        this.logger = new Logger(UserRouter.name).getLogger();
        this.userRouter = new Router({ prefix: "/users" });

        this.userRouter.get("/", async (ctx: Context): Promise<void> => {
            const token: string | undefined = ctx.cookies.get("auth_token");
            if (!isAuthenticated(token) || !isAdmin(token)) {
                ctx.throw(403, "Not Authorised");
            }

            try {
                const users: User[] = await this.userService.find();
                ctx.response.body = users;
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error fetching users");
            }
        });

        this.userRouter.get("/:id", async (ctx: Context) => {
            const token: string | undefined = ctx.cookies.get("auth_token");
            const id: string = ctx.params.id;
            if (!isAuthenticated(token) || !isSelf(token, id) || !isAdmin(token)) {
                ctx.throw(403, "Not Authorised");
            }

            try {
                const user: User = await this.userService.findById(ctx.params.id);
                ctx.response.body = user;
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error fetching user");
            }
        });

        this.userRouter.patch("/:id", async (ctx: Context) => {
            const token: string | undefined = ctx.cookies.get("auth_token");
            if (!isAuthenticated(token) || !isAdmin(token)) {
                ctx.throw(403, "Not Authorised");
            }

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

        this.userRouter.delete("/:id", async (ctx: Context) => {
            const token: string | undefined = ctx.cookies.get("auth_token");
            if (!isAuthenticated(token) || !isAdmin(token)) {
                ctx.throw(403, "Not Authorised");
            }

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
