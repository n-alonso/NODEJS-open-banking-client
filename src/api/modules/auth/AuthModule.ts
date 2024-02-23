import Koa from "koa";
import Router from "@koa/router";
import { IoCContainer } from "../../../core/IoCContainer";
import { AuthRouter } from "./AuthRouter";

const container: IoCContainer = IoCContainer.getInstance();

export class AuthModule {
    public static register(): void {
        container.register(AuthRouter.name, new AuthRouter());
    }

    public static load(app: Koa): void {
        const router: Router = container.resolve<AuthRouter>(AuthRouter.name).getRouter();
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
}
