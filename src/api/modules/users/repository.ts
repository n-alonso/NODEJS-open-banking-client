import { Knex } from "knex";
import { User } from "./models/user-entity";
import { CrudRepository } from "../../../db/models/crud-repository";
import { IoCContainer } from "../../../core/ioc-container";
import winston from "winston";
import { Logger } from "../../../libs/Logger";

export class UserRepository implements CrudRepository<User> {
    readonly dataSource: Knex;
    private readonly logger: winston.Logger;

    public constructor() {
        this.dataSource = IoCContainer.getInstance().resolve("DataSource");
        this.logger = new Logger(UserRepository.name).getLogger();
    }

    public async find(): Promise<User[]> {
        try {
            return await this.dataSource.select().from("users");
        } catch (err: unknown) {
            this.logger.error(err);
            throw err;
        }
    }

    public async findBy(byKey: string, byValue: unknown): Promise<User> {
        return await this.dataSource
            .select()
            .from("users")
            .where({ [byKey]: byValue })
            .first();
    }

    public async create(user: Omit<User, "id">): Promise<User> {
        try {
            const [newUser] = await this.dataSource.table("users").insert(user).returning("*");
            return newUser;
        } catch (err: unknown) {
            this.logger.error(err);
            throw err;
        }
    }

    public async updateBy(
        byKey: string,
        byValue: unknown,
        updateKey: keyof User,
        updateValue: User[keyof User],
    ): Promise<User> {
        try {
            const [updatedUser] = await this.dataSource
                .table("users")
                .where({ [byKey]: byValue })
                .update({ [updateKey]: updateValue })
                .returning("*");
            return updatedUser;
        } catch (err: unknown) {
            this.logger.error(err);
            throw err;
        }
    }

    public async deleteBy(byKey: string, byValue: unknown): Promise<User> {
        try {
            const [deletedUser] = await this.dataSource("users")
                .where({ [byKey]: byValue })
                .delete()
                .returning("*");
            return deletedUser;
        } catch (err: unknown) {
            this.logger.error(err);
            throw err;
        }
    }
}
