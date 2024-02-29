export class ApplicationConfig {
    public readonly PORT: number;
    public readonly DATABASE?: string;

    private constructor() {
        this.PORT = Number(process.env.PORT);
        this.DATABASE = String(process.env.DATABASE);

        if (!this.PORT) throw new Error("Expected PORT variable not found at ApplicationConfig.");
    }

    public static getApplicationConfig(): ApplicationConfig {
        // TODO: Add Env-specific configs
        return new ApplicationConfig();
    }
}
