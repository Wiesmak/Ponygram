import Model from "../../lib/model.ts"
import {History, Status, Tag} from "../../util/types.ts"
import {ObjectId} from "mongodb"
import {db} from "../../index.ts"

export default class Image extends Model {
    private collection = db.collection('images')

    constructor(
        public album: string,
        public originalName: string,
        public url: string,
        public lastChange?: Status,
        public history?: History[],
        public tags: Tag[] = [],
        public id?: ObjectId
    ) {
        super(id)
    }

    public static async find(id: ObjectId): Promise<Image> {
        const entity = await db.collection('images').findOne({_id: id})
        return entity ? new this(entity.album, entity.originalName, entity.url, entity.lastChange, entity.history, entity.tags, entity._id) : null
    }

    public static async all(): Promise<Image[]> {
        const entities = await db.collection('images').find().toArray()
        return entities.map(entity => new this(entity.album, entity.originalName, entity.url, entity.lastChange, entity.history, entity.tags, entity._id))
    }
}
