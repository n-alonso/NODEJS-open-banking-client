import dotenv from "dotenv";

export class ApplicationConfig {

    public readonly PORT: number;
    public readonly DATABASE?: string;

    public constructor() {
        dotenv.config();

        this.PORT = Number(process.env.PORT);
        this.DATABASE = String(process.env.DATABASE);

        if (!this.PORT) throw new Error("Expected PORT variable not found.");
    }
}