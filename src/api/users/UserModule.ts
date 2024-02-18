import Koa from "koa";
import { IoCContainer } from "../../core/IoCContainer";
import { UserRepository } from "./UserRepository";
import { UserRouter } from "./UserRouter";
import Router from "@koa/router";
import { UserService } from "./UserService";
const container = IoCContainer.getInstance();

export class UserModule {
    public static register(): void {
        container.register(UserRepository.name, new UserRepository());
        container.register(UserService.name, new UserService());
        container.register(UserRouter.name, new UserRouter());
    }

    public static load(app: Koa): void {
        const router: Router = container.resolve<UserRouter>(UserRouter.name).getRouter();
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
}
