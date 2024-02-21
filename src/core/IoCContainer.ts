// import Router from "@koa/router";
// import Koa, { Middleware } from "koa";
// import middlewares from "../api/middlewares/export";
// import routes from "../api/routes/export";
// import repositories from "../api/repositories/export";
// import { CrudRepository } from "../api/repositories/CrudRepository.interface";
import { Knex } from "knex";
import { DataSource } from "../db/DataSource";

export class IoCContainer {
    private static instance: IoCContainer;
    private dataSource: Knex;

    private readonly components: Map<string, unknown>;

    private constructor() {
        this.dataSource = DataSource.getInstance();
        this.components = new Map();

        // this.middlewares = [];
        // this.routes = [];
        // this.repositories = [];
    }

    public static getInstance(): IoCContainer {
        if (!IoCContainer.instance) {
            IoCContainer.instance = new IoCContainer();
        }
        return IoCContainer.instance;
    }

    public getDataSource(): Knex {
        return this.dataSource;
    }

    public register<T>(name: string, component: T): void {
        this.components.set(name, component);
    }

    public resolve<T>(name: string): T {
        const component = this.components.get(name);
        if (!component) {
            throw new Error("No instance found for name: " + name);
        }
        return component as T;
    }

    // public registerComponents(): void {
    //     this.middlewares.push(...middlewares);
    //     this.routes.push(...routes);
    //     repositories.forEach((repositoryFactory) => {
    //         this.repositories.push(repositoryFactory(this.dataSource));
    //     });
    // }

    // public loadComponents(app: Koa): void {
    //     this.middlewares.forEach((middleware) => {
    //         app.use(middleware);
    //     });
    //     this.routes.forEach((route) => {
    //         app.use(route.routes());
    //         app.use(route.allowedMethods());
    //     });
    // }
}
