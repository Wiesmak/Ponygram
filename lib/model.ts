import {UUID} from "../util/types.ts"

/**
 * Base class for all models
 * @remarks This class is abstract and should not be instantiated directly.
 * @abstract
 * @class Model
 * @see {@link Controller}
 * @example
 * class User extends Model {
 *    constructor(
 *      public id: UUID,
 *      public username: string,
 *      public password: string,
 *    ) {
 *      super(id)
 *    }
 *    public static save(user: User): void {
 *      // ...
 *    }
 *    public static find(id: UUID): User {
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
     * @param {UUID} id - The unique identifier for the model.
     * @remarks This constructor is protected and should not be called directly.
     * @param id
     * @protected
     * @memberof Model
     */
    protected constructor(public id: UUID) {}

    public static save(): void {

    }
}
