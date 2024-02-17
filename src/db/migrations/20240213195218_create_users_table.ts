import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.string("email");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
