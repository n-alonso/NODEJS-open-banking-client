import * as jwt from "jsonwebtoken";
import { UserRoles } from "../modules/users/models/UserRoles.enum";

interface PayloadWithRole extends jwt.JwtPayload {
    role: UserRoles;
}

export default function (token: string | undefined): boolean {
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as PayloadWithRole;
        if (decoded?.role === "admin") return true;
    } catch (err: unknown) {
        return false;
    }

    return false;
}
