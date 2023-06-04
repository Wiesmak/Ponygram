import Image from "./Image.ts"
import {History, Status, Tag} from "../../util/types.ts"
import {ObjectId} from "mongodb"
import {db} from "../../index.ts"

export default class ImageTag extends Image {
    constructor(
        id: ObjectId,
        album: string,
        originalName: string,
        url: string,
        lastChange: Status,
        history: History[],
        public tags: Tag[]
    ) {
        super(
            album,
            originalName,
            url,
            lastChange,
            history,
            tags,
            id
        )
    }

    public static async find(id: ObjectId): Promise<ImageTag> {
        const entity = await db.collection('images').findOne({_id: id})
        return entity ? new this(entity._id, entity.album, entity.originalName, entity.url, entity.lastChange, entity.history, entity.tags) : null
    }
}
