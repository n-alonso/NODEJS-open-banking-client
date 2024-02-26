import Koa from "koa";
import { IoCContainer } from "./IoCContainer";
import { ApplicationConfig } from "../config/ApplicationConfig";
import { DataSource } from "../db/DataSource";
import { onError } from "../api/middlewares/common/onError.middleware";
import { glob } from "glob";
import path from "path";
import winston from "winston";
import { Logger } from "../libs/Logger";

export class Application {
    private static instance: Application;
    public readonly app: Koa;
    public readonly container: IoCContainer;
    public readonly config: ApplicationConfig;
    private readonly logger: winston.Logger;

    private constructor() {
        this.app = new Koa();
        this.container = IoCContainer.getInstance();
        this.config = ApplicationConfig.getApplicationConfig();
        this.logger = new Logger(Application.name).getLogger();
    }

    public static getInstance(): Application {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
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
        this.container.register(DataSource.name, DataSource.getInstance());
    }

    private async registerRepositories(): Promise<void> {
        try {
            const search =
                process.env.NODE_ENV === "production"
                    ? "dist/api/modules/**/*Repository.js"
                    : "src/api/modules/**/*Repository.ts";
            const repositoryPaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of repositoryPaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                const fileExtension = path.extname(relativePath);
                const fileName = path.basename(relativePath, fileExtension);

                let importedRepository;
                try {
                    importedRepository = await import(relativePath);
                    const repositoryClass =
                        importedRepository?.default?.default?.[fileName] ||
                        importedRepository?.default?.[fileName] ||
                        importedRepository?.[fileName];
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
                    ? "dist/api/modules/**/*Service.js"
                    : "src/api/modules/**/*Service.ts";
            const servicePaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of servicePaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                const fileExtension = path.extname(relativePath);
                const fileName = path.basename(relativePath, fileExtension);

                let importedService;
                try {
                    importedService = await import(relativePath);
                    const serviceClass =
                        importedService?.default?.default?.[fileName] ||
                        importedService?.default?.[fileName] ||
                        importedService?.[fileName];
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
                    ? "dist/api/middlewares/**/*.middleware.js"
                    : "src/api/middlewares/**/*.middleware.ts";
            const middlewarePaths: string[] = await glob(search, {
                ignore: ["node_modules/**", "**/*onError.middleware.ts"],
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
                    ? "dist/api/modules/**/*Router.js"
                    : "src/api/modules/**/*Router.ts";
            const routerPaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of routerPaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                const fileExtension = path.extname(relativePath);
                const fileName = path.basename(relativePath, fileExtension);

                let importedRouter;
                try {
                    importedRouter = await import(relativePath);
                    const routerClass =
                        importedRouter?.default?.default?.[fileName] ||
                        importedRouter?.default?.[fileName] ||
                        importedRouter?.[fileName];
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
