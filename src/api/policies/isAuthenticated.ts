import * as jwt from "jsonwebtoken";
import { Context, Next } from "koa";

export default function (ctx: Context, next: Next): void {
    const token: string | undefined = ctx.cookies.get("auth_token");
    if (!token) {
        ctx.throw(401, "Authentication required");
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (err: unknown) {
        ctx.throw(403, "Not authorised");
    }
}
