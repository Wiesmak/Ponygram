import Model from "../../lib/model.ts"
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb"
import {db} from "../../index.ts"

export default class Tag extends Model {
    private collection = db.collection('tags')

    constructor(
        public name: string,
        public popularity?: number,
        public id?: ObjectId
    ) {
        super(id)
    }


    public static async find(id: ObjectId | string): Promise<Tag> {
        const entity = await db.collection('tags').findOne(typeof id === "string" ? {name: id} : {_id: id})
        return entity ? new this(entity.name, entity.popularity, entity._id) : null
    }

    public static async all(): Promise<Tag[]> {
        const entities = await db.collection('tags').find().toArray()
        return entities.map(entity => new this(entity.name, entity.popularity, entity._id))
    }
}
