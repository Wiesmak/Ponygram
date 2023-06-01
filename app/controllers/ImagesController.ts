import Controller from "../../lib/controller.ts"
import Status from "../../util/status.ts"
import Image from "../models/Image.ts"
import {InsertOneResult, ObjectId} from "mongodb"

export default class ImagesController extends Controller {
    public index() {
        this.respond(Status.Ok, {message: 'Hello, world!'})
    }

    public async show(id: ObjectId) {
        this.model = await Image.find(id)
        const {collection, ...entity} = this.model
        if (this.model) {
            this.respond(Status.Ok, entity)
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    public async create() {
        const body = await this.parseBody()
        this.model = new Image(body.album, body.originalName, body.url, body.lastChange, body.history)
        const result = await this.model.save() as InsertOneResult<Document>
        this.respond(Status.Created, {message: `Created image ${result.insertedId}`})
    }
}
