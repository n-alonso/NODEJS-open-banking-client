import * as jwt from "jsonwebtoken";

interface PayloadWithId extends jwt.JwtPayload {
    id: number;
}

export default function (token: string | undefined, id: string) {
    if (!token) return false;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as PayloadWithId;
        if (decoded?.id === Number(id)) return true;
    } catch (err: unknown) {
        return false;
    }

    return false;
}
