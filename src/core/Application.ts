import Koa from "koa";
import { IoCContainer } from "./IoCContainer";
import { ApplicationConfig } from "../config/ApplicationConfig";
import { DataSource } from "../db/DataSource";
import { glob } from "glob";
import path from "path";

export class Application {
    private static instance: Application;
    public readonly app: Koa;
    public readonly container: IoCContainer;
    public readonly config: ApplicationConfig;

    private constructor() {
        this.app = new Koa();
        this.container = IoCContainer.getInstance();
        this.config = new ApplicationConfig();
    }

    public static getInstance(): Application {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
    }

    public async register(): Promise<void> {
        // Register the DataSource first, as it is needed by the modules
        this.container.register(DataSource.name, DataSource.getInstance());

        // Load all middlewares into the app
        this.registerMiddlewares();

        // Scan the repo and automatically register all modules
        this.registerModules();
    }

    public bootstrap(): void {
        const PORT: number = this.config.PORT;
        this.app.listen(PORT, (): void => {
            console.info(`Listening on port ${PORT}`);
        });
    }

    public async registerModules(): Promise<void> {
        try {
            const search = process.env.NODE_ENV === "production" ? "dist/**/*Module.js" : "src/**/*Module.ts";
            const modulePaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of modulePaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                const moduleName = path.basename(relativePath).replace(/.[tj]s$/, "");
                let module;
                try {
                    module = await import(relativePath);
                    // Register dependencies in the container
                    module?.[moduleName]?.register();
                    module?.default?.[moduleName]?.register();
                    // Load routes into the app
                    module?.[moduleName]?.load?.(this.app);
                    module?.default?.[moduleName]?.load?.(this.app);
                } catch (err: unknown) {
                    console.error(err);
                    throw new Error("Error importing module");
                }
            }
        } catch (err: unknown) {
            console.error(err);
            throw new Error("Error scanning for modules");
        }
    }

    public async registerMiddlewares(): Promise<void> {
        try {
            const search = process.env.NODE_ENV === "production" ? "dist/**/*.middleware.js" : "src/**/*.middleware.ts";
            const middlewarePaths: string[] = await glob(search, {
                ignore: "node_modules/**",
                absolute: true,
            });
            for (const absolutePath of middlewarePaths) {
                const relativePath = path.relative(__dirname, absolutePath);
                let middleware;
                try {
                    middleware = await import(relativePath);

                    // Account for regular and default exports, but also compiled JS has default.default for some reason
                    if (middleware.default.default) this.app.use(middleware.default.default());
                    else if (middleware.default) this.app.use(middleware.default());
                    else if (middleware && !middleware.default) this.app.use(middleware());
                    else {
                        throw new Error("No middleware!");
                    }
                } catch (err: unknown) {
                    console.error(err);
                    throw new Error("Error importing middleware");
                }
            }
        } catch (err: unknown) {
            console.error(err);
            throw new Error("Error scanning for middlewares");
        }
    }
}
