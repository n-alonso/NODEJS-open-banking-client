import Koa from "koa";
import { IoCContainer } from "./IoCContainer";
import { ApplicationConfig } from "../config/ApplicationConfig";


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

    public register(): void {
        this.container.registerComponents();
    }

    public bootstrap(): void {
        this.container.loadComponents(this.app);

        const PORT: number = this.config.PORT;
        this.app.listen(PORT, (): void => {
            console.log(`Listening on port ${PORT}`);
        });
    }
}