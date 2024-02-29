export class IoCContainer {
    private static instance: IoCContainer;

    private readonly components: Map<string, unknown>;

    private constructor() {
        this.components = new Map();
    }

    public static getInstance(): IoCContainer {
        if (!IoCContainer.instance) {
            IoCContainer.instance = new IoCContainer();
        }
        return IoCContainer.instance;
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
}
