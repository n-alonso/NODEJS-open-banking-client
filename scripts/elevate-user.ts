import knex, { Knex } from "knex";
import knexFile from "../knexfile";

const environment: string = process.env.NODE_ENV || "development";
const config = knexFile[environment as keyof typeof knexFile];
const db: Knex = knex(config);

/**
 * To be used with CLI command `yarn user:elevate <user_id>`
 */

async function elevateUser(id: string) {
    try {
        const userExists = await db.select().from("users").where({ id: id }).first();
        if (!userExists) {
            console.log(`User with id: ${id} does not exist.`);
            process.exit(1);
        }

        await db.table("users").where({ id: id }).update({ role: "admin" });
        console.log(`User with id ${id} has been elevated to admin.`);
    } catch (error) {
        console.error("Failed to create or update admin user:", error);
    } finally {
        db.destroy();
    }
}

// Read id from command line arguments
const id: string = process.argv[2];

if (!id) {
    console.log("Please provide a user id.");
    process.exit(1);
}

elevateUser(id);
