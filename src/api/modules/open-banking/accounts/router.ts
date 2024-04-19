import Router from "@koa/router";
import { Context } from "koa";
import { IoCContainer } from "../../../../core/ioc-container";
import winston from "winston";
import { Logger } from "../../../../libs/logger";
import { Crypto } from "../../../../libs/crypto";
import { UserService } from "../../users/service";
import isAuthenticated from "../../../policies/is-authenticated";
import { User } from "../../users/models/user-entity";
import { AccountsService } from "./service";

export class AccountsRouter {
    private readonly accountsRouter: Router;
    private readonly logger: winston.Logger;
    private readonly userService: UserService;
    private readonly accountsService: AccountsService;
    // private readonly crypto: Crypto;
    public constructor() {
        this.userService = IoCContainer.getInstance().resolve("UserService");
        this.logger = new Logger(AccountsRouter.name).getLogger();
        //     this.crypto = new Crypto();
        this.accountsRouter = new Router({ prefix: "/accounts" });

        this.accountsRouter.get("/", isAuthenticated, async (ctx: Context): Promise<void> => {
            try {
                const user: User = await this.userService.findById(ctx.user.id);
                const accounts = await this.accountsService.findBy("user", user);
                ctx.response.body = accounts;
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error fetching accounts");
            }
        });

        this.accountsRouter.get("/sync", isAuthenticated, async (ctx: Context): Promise<void> => {
            try {
                const authUrl: string = await this.obService.getAuthUrl();
                ctx.response.body = {
                    authUrl: authUrl,
                };
            } catch (err: unknown) {
                this.logger.error(err);
                ctx.throw(500, "Error syncing user's accounts");
            }
        });

        // TODO finish callback
        this.accountsRouter.get("/sync/callback");
    }
    public getRouter(): Router {
        return this.accountsRouter;
    }
}
