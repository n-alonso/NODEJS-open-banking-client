import * as jwt from "jsonwebtoken";
import { UserRoles } from "../modules/users/models/user-roles";
import { Context, Next } from "koa";

interface PayloadWithRole extends jwt.JwtPayload {
    role: UserRoles;
}

export default async function (ctx: Context, next: Next): Promise<void> {
    const token: string | undefined = ctx.cookies.get("auth_token");
    if (!token) {
        ctx.throw(401, "Authentication required");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as PayloadWithRole;
        if (decoded?.role === "admin") await next();
        else ctx.throw(403, "Not Authorised");
    } catch (err: unknown) {
        ctx.throw(403, "Not Authorised");
    }
}
