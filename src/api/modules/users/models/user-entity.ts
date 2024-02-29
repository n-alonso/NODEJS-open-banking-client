import { UserRoles } from "./user-roles";

export interface User {
    readonly id: number;
    readonly googleid: string;
    readonly name?: string | undefined;
    readonly email?: string | undefined;
    readonly role: UserRoles;
}
