import cors from "@koa/cors";

export default cors({
    origin: "http://example.com",
    maxAge: 5,
    credentials: true,
});
