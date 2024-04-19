import Koa from "koa";
import { IoCContainer } from "./ioc-container";
import { ApplicationConfig } from "../config/application";
import { SqlDataSource } from "../db/sources/sql";
import { OpenBankingDataSource } from "../db/sources/open-banking";
import { onError } from "../api/middlewares/common/on-error";
import { glob } from "glob";
import path from "path";
import winston from "winston";
import { Logger } from "../libs/logger";

export class Orchestrator {
    private static instance: Orchestrator;
    public readonly app: Koa;
    public readonly container: IoCContainer;
    public readonly config: ApplicationConfig;
    private readonly logger: winston.Logger;

    private constructor() {
        this.app = new Koa();
        this.container = IoCContainer.getInstance();
        this.config = ApplicationConfig.getApplicationConfig();
        this.logger = new Logger(Orchestrator.name).getLogger();
    }

    public static getInstance(): Orchestrator {
        if (!Orchestrator.instance) {
            Orchestrator.instance = new Orchestrator();
        }
        return Orchestrator.instance;
    }

    public async register(): Promise<void> {
        await this.registerErrorMiddleware();
        this.registerDataSource();
        await this.registerRepositories();
        await this.registerServices();
        await this.registerMiddlewares();
        await this.registerRouters();
    }

    public bootstrap(): void {
        const PORT: number = this.config.PORT;
        this.app.listen(PORT, (): void => {
            this.logger.info(`Listening on port ${PORT}`);
        });
    }

    private registerDataSource(): void {
        this.container.register(SqlDataSource.name, SqlDataSource.getInstance());
        this.container.register(OpenBankingDataSource.name, new OpenBankingDataSource());
    }

    private async registerRepositories(): Promise<void> {
        try {
            const search =
                process.env.NODE_ENV === "production"
                    ? "dist/src/api/modules/**/*repository.js"
                    : "src/api/modules/**/*repository.ts";
            const repositoryPaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of repositoryPaths) {
                const relativePath = path.relative(__dirname, absolutePath);

                let importedRepository;
                try {
                    importedRepository = await import(relativePath);
                    importedRepository =
                        importedRepository?.default?.default || importedRepository?.default || importedRepository;

                    const repositoryName = Object.keys(importedRepository)[0];
                    const repositoryClass = importedRepository[repositoryName];
                    if (!repositoryClass) throw new Error("No repository!");

                    this.container.register(repositoryClass.name, new repositoryClass());
                } catch (err: unknown) {
                    this.logger.error(err);
                    throw new Error("Error registering repository");
                }
            }
        } catch (err: unknown) {
            this.logger.error(err);
            throw new Error("Error scanning for repositories");
        }
    }

    private async registerServices(): Promise<void> {
        try {
            const search =
                process.env.NODE_ENV === "production"
                    ? "dist/src/api/modules/**/*service.js"
                    : "src/api/modules/**/*service.ts";
            const servicePaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of servicePaths) {
                const relativePath = path.relative(__dirname, absolutePath);

                let importedService;
                try {
                    importedService = await import(relativePath);
                    importedService = importedService?.default?.default || importedService?.default || importedService;

                    const serviceName = Object.keys(importedService)[0];
                    const serviceClass = importedService[serviceName];
                    if (!serviceClass) throw new Error("No service!");

                    this.container.register(serviceClass.name, new serviceClass());
                } catch (err: unknown) {
                    this.logger.error(err);
                    throw new Error("Error registering service");
                }
            }
        } catch (err: unknown) {
            this.logger.error(err);
            throw new Error("Error scanning for services");
        }
    }

    private async registerErrorMiddleware(): Promise<void> {
        try {
            this.app.use(onError);
        } catch (err: unknown) {
            this.logger.error(err);
            throw new Error("Error importing error middleware");
        }
    }

    private async registerMiddlewares(): Promise<void> {
        try {
            const search =
                process.env.NODE_ENV === "production"
                    ? "dist/src/api/middlewares/**/*.js"
                    : "src/api/middlewares/**/*.ts";
            const middlewarePaths: string[] = await glob(search, {
                ignore: ["node_modules/**", "**/*on-error*"],
                absolute: true,
            });
            for (const absolutePath of middlewarePaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                let importedMiddleware;
                try {
                    importedMiddleware = await import(relativePath);
                    const middleware =
                        importedMiddleware?.default?.default || importedMiddleware?.default || importedMiddleware;
                    if (!middleware) throw new Error("No middleware!");

                    this.app.use(middleware);
                } catch (err: unknown) {
                    this.logger.error(err);
                    throw new Error("Error importing middleware");
                }
            }
        } catch (err: unknown) {
            this.logger.error(err);
            throw new Error("Error scanning for middlewares");
        }
    }

    private async registerRouters(): Promise<void> {
        try {
            const search =
                process.env.NODE_ENV === "production"
                    ? "dist/src/api/modules/**/*router.js"
                    : "src/api/modules/**/*router.ts";
            const routerPaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of routerPaths) {
                const relativePath = path.relative(__dirname, absolutePath);

                let importedRouter;
                try {
                    importedRouter = await import(relativePath);
                    importedRouter = importedRouter?.default?.default || importedRouter?.default || importedRouter;

                    const routerName = Object.keys(importedRouter)[0];
                    const routerClass = importedRouter[routerName];
                    if (!routerClass) throw new Error("No router!");

                    const routerInstance = new routerClass();
                    const router = routerInstance.getRouter();

                    this.app.use(router.routes());
                    this.app.use(router.allowedMethods());
                } catch (err: unknown) {
                    this.logger.error(err);
                    throw new Error("Error applying router");
                }
            }
        } catch (err: unknown) {
            this.logger.error(err);
            throw new Error("Error scanning for routers");
        }
    }
}
