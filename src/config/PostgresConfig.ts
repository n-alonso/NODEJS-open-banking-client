import dotenv from "dotenv";

export class PostgresConfig {

    public readonly DB_HOST: string;
    public readonly DB_PORT: number;
    public readonly DB_NAME: string;
    public readonly DB_USERNAME: string;
    public readonly DB_PASSWORD: string;

    public constructor() {
        dotenv.config();

        this.DB_HOST = String(process.env.DB_HOST);
        this.DB_PORT = Number(process.env.DB_PORT);
        this.DB_NAME = String(process.env.DB_NAME);
        this.DB_USERNAME = String(process.env.DB_USERNAME);
        this.DB_PASSWORD = String(process.env.DB_PASSWORD);
    }
}