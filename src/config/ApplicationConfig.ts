export class ApplicationConfig {
    public readonly PORT: number;
    public readonly DATABASE?: string;

    public constructor() {
        this.PORT = Number(process.env.PORT);
        this.DATABASE = String(process.env.DATABASE);

        if (!this.PORT) throw new Error("Expected PORT variable not found.");
    }
}
