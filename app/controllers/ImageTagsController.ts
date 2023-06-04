import Controller from "../../lib/controller.ts"
import ImageTag from "../models/ImageTag.ts"
import {ObjectId} from "mongodb"
import Status from "../../util/status.ts"

export default class ImageTagsController extends Controller {
    protected model: ImageTag
    public async show(id: ObjectId) {
        this.model = await ImageTag.find(id)
        const {collection, ...entity} = this.model
        if (this.model) {
            const tags = entity.tags.map(tag => {
                return {
                    name: tag.name,
                }
            })
            this.respond(Status.Ok, {
                id: entity.id,
                tags: tags
            })
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    public async replace(id: ObjectId) {
        this.model = await ImageTag.find(id)
        const body = await this.parseBody()
        if (this.model) {
            this.model.tags = body.tags ?? this.model.tags
            await this.model.save()
            this.respond(Status.Ok, {message: `Updated image ${id}'s tags`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    public async update(id: ObjectId) {
        this.model = await ImageTag.find(id)
        const body = await this.parseBody()
        if (this.model) {
            this.model.tags = Array.from(new Set([...this.model.tags, ...body.tags].map(tag => tag.name))).map(name => ({ name }))
            await this.model.save()
            this.respond(Status.Ok, {message: `Added tags to image ${id}`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    public async destroy(id: ObjectId) {
        this.model = await ImageTag.find(id)
        if (this.model) {
            this.model.tags = []
            await this.model.save()
            this.respond(Status.Ok, {message: `Deleted image ${id}'s tags`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }
}
