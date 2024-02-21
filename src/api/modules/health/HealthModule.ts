import Koa from "koa";
import { IoCContainer } from "../../../core/IoCContainer";
import { HealthRouter } from "./HealthRouter";
import Router from "@koa/router";
const container: IoCContainer = IoCContainer.getInstance();

export class HealthModule {
    public static register(): void {
        container.register(HealthRouter.name, new HealthRouter());
    }

    public static load(app: Koa): void {
        const router: Router = container.resolve<HealthRouter>(HealthRouter.name).getRouter();
        app.use(router.routes());
        app.use(router.allowedMethods());
    }
}
