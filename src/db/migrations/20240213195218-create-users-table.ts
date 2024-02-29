import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("users", (table) => {
        table.increments();
        table.string("googleid").notNullable();
        table.string("name");
        table.string("email");
        table.string("role").notNullable().defaultTo("user");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
