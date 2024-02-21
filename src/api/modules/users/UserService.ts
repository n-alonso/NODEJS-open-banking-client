import { IoCContainer } from "../../../core/IoCContainer";
import { User } from "./UserEntity.interface";
import { UserRepository } from "./UserRepository";

export class UserService {
    readonly repository: UserRepository;

    public constructor() {
        this.repository = IoCContainer.getInstance().resolve("UserRepository");
    }

    public async find(): Promise<User[]> {
        return await this.repository.find();
    }

    public async findOne(id: string): Promise<User[]> {
        return await this.repository.findOne(id);
    }
}
