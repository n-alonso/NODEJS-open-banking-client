import knex, { Knex } from "knex";
import knexFile from "../../knexfile";

const environment: string = process.env.NODE_ENV || "development";

export class DataSource {
    private static dataSource: Knex;

    private constructor() {}

    public static getInstance(): Knex {
        if (!DataSource.dataSource) {
            const config = knexFile[environment as keyof typeof knexFile];
            DataSource.dataSource = knex(config);
        }
        return DataSource.dataSource;
    }
}
