const CONSTANTS = ({
    // Application
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    // Database
    DB_CLIENT: process.env.DB_CLIENT,
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_MIGRATIONS_DIRECTORY: process.env.DB_MIGRATIONS_DIRECTORY,
    DB_SEEDS_DIRECTORY: process.env.DB_SEEDS_DIRECTORY,
    // Google OAuth20
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK: process.env.CALLBACK,
    // Crypto
    SECRET_KEY: process.env.SECRET_KEY,
    SECRET_IV: process.env.SECRET_IV,
    ENCRYPTION_METHOD: process.env.ENCRYPTION_METHOD,
} = process.env);

Object.entries(CONSTANTS).forEach(([key, value]) => {
    if (typeof value === "undefined") throw new Error(`${key} required but is missing`);
});

export default CONSTANTS;
