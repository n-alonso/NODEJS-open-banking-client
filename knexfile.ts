import dotenv from "dotenv";
import path from "path";
dotenv.config();

export default {
    development: {
        client: String(process.env.DB_CLIENT),
        connection: String(process.env.DB_CONNECTION),
        migrations: {
            directory: path.join(__dirname + String(process.env.DB_MIGRATIONS_DIRECTORY)),
        },
        seeds: {
            directory: path.join(__dirname + String(process.env.DB_SEEDS_DIRECTORY)),
        },
    },
    production: {
        client: String(process.env.DB_CLIENT),
        connection: String(process.env.DOCKER_COMPOSE_CONNECTION),
        migrations: {
            directory: path.join(__dirname + String(process.env.DB_MIGRATIONS_DIRECTORY)),
        },
        seeds: {
            directory: path.join(__dirname + String(process.env.DB_SEEDS_DIRECTORY)),
        },
    },
};
