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
        console.log("ADMIN");
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as PayloadWithRole;
        console.log("ADMIN");
        if (decoded?.role === "admin") await next();
        else ctx.throw(403, "Not Authorised");
        console.log("ADMIN");
    } catch (err: unknown) {
        console.log("ADMIN ERR");
        ctx.throw(403, "Not Authorised");
    }
}
