// import { Knex } from "knex";

export async function seed(/*knex: Knex*/): Promise<void> {
    /**
     * At the moment there is no point in seeding users since the only way to login is with Google OAuth20
     */
    // // Deletes ALL existing entries
    // await knex("users").del();
    // // Inserts seed entries
    // await knex("users").insert([{ googleid: "kwjer239438", name: "admin", email: "test@test.test", role: "admin" }]);
}
