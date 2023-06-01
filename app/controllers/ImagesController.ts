import Controller from "../../lib/controller.ts"
import Status from "../../util/status.ts"
import Image from "../models/Image.ts"
import {InsertOneResult} from "mongodb"

export default class ImagesController extends Controller {
    public index() {
        this.respond(Status.Ok, {message: 'Hello, world!'})
    }

    public show(id: string) {
        this.respond(Status.Ok, {message: `Hello, ${id ?? 'world'}!`})
    }

    public async create() {
        const body = await this.parseBody()
        this.model = new Image(body.album, body.originalName, body.url, body.lastChange, body.history)
        const result = await this.model.save() as InsertOneResult<Document>
        this.respond(Status.Created, {message: `Created image ${result.insertedId}`})
    }
}
