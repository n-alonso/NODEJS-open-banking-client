export interface CrudRepository<T> {
    find(): Promise<T[]>;
    findOne(id: string): Promise<T[]>;
    // save(): Promise<T>;
    // update(id: string): Promise<T>;
    // remove(id: string): Promise<T>;
}
