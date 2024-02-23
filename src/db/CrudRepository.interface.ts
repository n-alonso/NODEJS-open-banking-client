interface withId {
    id: number;
}

export interface CrudRepository<T extends withId> {
    find(): Promise<T[]>;
    findBy(byKey: string, byValue: unknown): Promise<T>;
    create(entry: T): Promise<T>;
    updateBy(byKey: string, byValue: unknown, updateKey: keyof T, updateValue: T[keyof T]): Promise<T>;
    deleteBy(byKey: string, byValue: unknown): Promise<T>;
}
