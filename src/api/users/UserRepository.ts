import { Knex } from "knex";
import { User } from "./UserEntity.interface";
import { CrudRepository } from "../interfaces/CrudRepository.interface";
import { IoCContainer } from "../../core/IoCContainer";

export class UserRepository implements CrudRepository<User> {
    readonly dataSource: Knex;

    public constructor() {
        this.dataSource = IoCContainer.getInstance().resolve("DataSource");
    }

    public async find(): Promise<User[]> {
        return await this.dataSource.select().from("users");
    }

    public async findOne(id: string): Promise<User[]> {
        return await this.dataSource.select().from("users").where("id", Number(id));
    }
}
