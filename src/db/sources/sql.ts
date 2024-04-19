import knex, { Knex } from "knex";
import knexFile from "../../../knexfile";

const environment: string = process.env.NODE_ENV || "development";

export class SqlDataSource {
    private static dataSource: Knex;

    private constructor() {}

    public static getInstance(): Knex {
        if (!SqlDataSource.dataSource) {
            const config = knexFile[environment as keyof typeof knexFile];
            SqlDataSource.dataSource = knex(config);
        }
        return SqlDataSource.dataSource;
    }
}
