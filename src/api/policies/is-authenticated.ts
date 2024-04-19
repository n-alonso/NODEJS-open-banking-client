import * as jwt from "jsonwebtoken";
import { Context, Next } from "koa";

export default async function (ctx: Context, next: Next): Promise<void> {
    const token: string | undefined = ctx.cookies.get("auth_token");
    if (!token) {
        ctx.throw(401, "Authentication required");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        ctx.user = decoded;
        await next();
    } catch (err: unknown) {
        ctx.throw(403, "Not authorised");
    }
}
