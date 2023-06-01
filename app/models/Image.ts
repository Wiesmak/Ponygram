import Model from "../../lib/model.ts"
import {Status} from "../../util/types.ts"
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb"
import {db} from "../../index.ts"

export default class Image extends Model {
    private collection = db.collection('images')

    constructor(
        public album: string,
        public originalName: string,
        public url: string,
        public lastChange: Status,
        public history: Status[],
        public id?: ObjectId
    ) {
        super(id)
    }

    public async save(): Promise<UpdateResult<Document> | InsertOneResult<Document>> {
        const {id, collection, ...entity} = this
        return this.id
            ? await this.collection.updateOne(
                {_id: this.id},
                {$set: entity},
                {upsert: !!(await this.collection.findOne({_id: this.id}))}
            ) : await db.collection('images').insertOne(entity)
    }
}