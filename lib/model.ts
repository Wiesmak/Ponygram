import {Collection, InsertOneResult, ObjectId, UpdateResult} from "mongodb"

/**
 * Base class for all models
 * @remarks This class is abstract and should not be instantiated directly.
 * @abstract
 * @class Model
 * @see {@link Controller}
 * @example
 * class User extends Model {
 *    constructor(
 *      public id: ObjectId,
 *      public username: string,
 *      public password: string,
 *    ) {
 *      super(id)
 *    }
 *    public static save(user: User): void {
 *      // ...
 *    }
 *    public static find(id: ObjectId): User {
 *      // ...
 *    }
 *    public static all(): User[] {
 *      // ...
 *    }
 * }
 */
export default abstract class Model {
    /**
     * Creates an instance of Model.
     * @param {ObjectId} id - The unique identifier for the model.
     * @remarks This constructor is protected and should not be called directly.
     * @param id
     * @protected
     * @memberof Model
     */
    protected constructor(public id?: ObjectId) {}

    protected abstract collection: Collection

    public async save(): Promise<UpdateResult<Document> | InsertOneResult<Document>> {
        const {id, collection, ...entity} = this
        return this.id
            ? await this.collection.updateOne(
                {_id: this.id},
                {$set: entity},
                {upsert: !!(await this.collection.findOne({_id: this.id}))}
            ) : await this.collection.insertOne(entity)
    }

    public async destroy(): Promise<boolean> {
        const result = await this.collection.deleteOne({_id: this.id})
        return !!result.deletedCount
    }
}
