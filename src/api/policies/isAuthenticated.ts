import * as jwt from "jsonwebtoken";

export default function (token: string | undefined) {
    if (!token) return false;
    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        return true;
    } catch (err: unknown) {
        return false;
    }
}
