import { SQLConfig } from "./SQLConfig.interface";
import knex, { Knex } from "knex";

export class PgDataSource implements SQLConfig {
    readonly client: string = String(process.env.DB_CLIENT);
    readonly connection: string = String(process.env.DB_CONNECTION);
    readonly migrations: { directory: string } = {
        directory: __dirname + String(process.env.DB_MIGRATIONS_DIRECTORY),
    };
    readonly seeds: { directory: string } = {
        directory: __dirname + String(process.env.DB_SEEDS_DIRECTORY),
    };
    private readonly knex: Knex;

    public constructor() {
        this.knex = knex({
            client: "pg",
            connection: this.connection,
            migrations: this.migrations,
            seeds: this.seeds,
        });
    }

    public getConnection(): Knex {
        return this.knex;
    }
}
