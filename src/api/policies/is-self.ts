import * as jwt from "jsonwebtoken";
import { Context, Next } from "koa";

interface PayloadWithId extends jwt.JwtPayload {
    id: number;
}

export default async function (ctx: Context, next: Next): Promise<void> {
    const token: string | undefined = ctx.cookies.get("auth_token");
    const id: string = ctx.params.id;
    if (!token) {
        ctx.throw(401, "Authentication required");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as PayloadWithId;
        if (decoded?.id === Number(id) || decoded?.role === "admin") await next();
        else ctx.throw(403, "Not authorised");
    } catch (err: unknown) {
        ctx.throw(403, "Not authorised");
    }
}
