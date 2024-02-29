import { IoCContainer } from "../../../core/ioc-container";
import { User } from "./models/user-entity";
import { UserRoles } from "./models/user-roles";
import { UserRepository } from "./repository";

export class UserService {
    readonly repository: UserRepository;

    public constructor() {
        this.repository = IoCContainer.getInstance().resolve("UserRepository");
    }

    public async find(): Promise<User[]> {
        return await this.repository.find();
    }

    public async findById(id: string): Promise<User> {
        return await this.repository.findBy("id", id);
    }

    public async findOrCreate(user: Omit<User, "id">): Promise<User> {
        const existingUser: User = await this.repository.findBy("googleid", user.googleid);
        if (!existingUser) {
            const newUser = await this.repository.create(user);
            return newUser;
        }
        return existingUser;
    }

    public async updateRole(id: string, role: UserRoles): Promise<User> {
        return await this.repository.updateBy("id", id, "role", role);
    }

    public async deleteById(id: string): Promise<User> {
        return await this.repository.deleteBy("id", id);
    }
}
