import Router from "@koa/router";
import Koa, { Middleware } from "koa";

import middlewares from "../api/middlewares/export";
import routes from "../api/routes/export";

export class IoCContainer {

    private static instance: IoCContainer;
    private readonly middlewares: Middleware[];
    private readonly routes: Router[];

    private constructor() {
        this.middlewares = [];
        this.routes = [];
    };

    public static getInstance(): IoCContainer {
        if (!IoCContainer.instance) {
            IoCContainer.instance = new IoCContainer();
        }
        return IoCContainer.instance;
    }

    public registerComponents(): void {
        this.middlewares.push(...middlewares);
        this.routes.push(...routes);
    }

    public loadComponents(app: Koa): void {
        this.middlewares.forEach(middleware => {
            app.use(middleware);
        });
        this.routes.forEach(route => {
            app.use(route.routes());
            app.use(route.allowedMethods());
        });
    }
}