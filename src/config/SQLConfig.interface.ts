import { Knex } from "knex";

export interface SQLConfig {
    readonly client: string;
    readonly connection: string;
    readonly migrations: { directory: string };
    readonly seeds: { directory: string };

    getConnection(): Knex;
}
