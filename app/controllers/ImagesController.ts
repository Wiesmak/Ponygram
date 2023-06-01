import Controller from "../../lib/controller.ts"
import Status from "../../util/status.ts"
import Image from "../models/Image.ts"
import {InsertOneResult, ObjectId} from "mongodb"
import Timestamp from "../../lib/timestamp.ts"

export default class ImagesController extends Controller {
    protected model: Image

    public async index() {
        const images = await Image.all()
        this.respond(
            Status.Ok,
            images.map(image => {
                const {collection, ...entity} = image
                return entity
            }) ?? []
        )
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
        this.model = new Image(body.album, body.originalName, body.url, "original",
            [
                {
                    status: "original",
                    timestamp: Timestamp.now()
                }
            ]
        )
        const result = await this.model.save() as InsertOneResult<Document>
        this.respond(Status.Created, {message: `Created image ${result.insertedId}`})
    }

    public async update(id: ObjectId) {
        const body = await this.parseBody()
        this.model = await Image.find(id)
        if (this.model) {
            this.model.album = body.album || this.model.album
            this.model.originalName = body.originalName || this.model.originalName
            this.model.url = body.url || this.model.url
            this.model.lastChange = this.model.lastChange === "original" ? "modified-1" : `modified-${parseInt(this.model.lastChange.split("-")[1]) + 1}` as `modified-${number}`
            this.model.history = [
                ...this.model.history,
                {
                    status: this.model.lastChange,
                    timestamp: Timestamp.now()
                }
            ]
            const result = await this.model.save()
            this.respond(Status.Ok, {message: `Updated image ${id}`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    public async destroy(id: ObjectId) {
        this.model = await Image.find(id)
        if (this.model) {
            await this.model.destroy()
            this.respond(Status.Ok, {message: `Deleted image ${id}`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }
}
