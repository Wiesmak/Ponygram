import Controller from "../../lib/controller.ts"
import Tag from "../models/Tag.ts"
import Status from "../../util/status.ts"
import {InsertOneResult, ObjectId, UpdateResult} from "mongodb"

export default class TagsController extends Controller {
    protected model: Tag

    public async index() {
        const tags = await Tag.all()
        this.respond(
            Status.Ok,
            tags.map(tag => {
                const {collection, ...entity} = tag
                return entity
            }) ?? []
        )
    }

    public async show(id: ObjectId) {
        this.model = await Tag.find(id)
        const {collection, ...entity} = this.model
        if (this.model) {
            this.respond(Status.Ok, entity)
        } else {
            this.respond(Status.NotFound, {message: `Tag ${id} not found`})
        }
    }

    public async raw() {
        const tags = await Tag.all()
        this.respond(Status.Ok, tags.map( tag => tag.name) ?? [])
    }

    public async create() {
        const body = await this.parseBody()
        const found = await Tag.find(body.name)
        console.log(found)
        if (found) {
            found.popularity++
            this.model = found
            const result = await this.model.save() as UpdateResult<Document>
            this.respond(Status.Ok, {message: `Updated tag ${result.upsertedId ?? this.model.id}`})
        } else {
            this.model = new Tag(body.name, 1)
            const result = await this.model.save() as InsertOneResult<Document>
            this.respond(Status.Created, {message: `Created tag ${result.insertedId ?? this.model.id}`})
        }
    }

    public async delete(id: ObjectId) {
        this.model = await Tag.find(id)
        if (this.model) {
            const result = await this.model.destroy()
            this.respond(Status.Ok, {message: `Deleted tag ${id}`})
        } else {
            this.respond(Status.NotFound, {message: `Tag ${id} not found`})
        }
    }
}
