import Controller from "../../lib/controller.ts"
import Status from "../../util/status.ts"
import Image from "../models/Image.ts"
import {InsertOneResult, ObjectId} from "mongodb"
import Timestamp from "../../lib/timestamp.ts"
import sharp from "sharp"
import ApplicationConfig from "../../config/application.ts"
import {Filter, TokenPayload} from "../../util/types"
import Authenticate from "../../lib/authenticate.ts"

export default class ImagesController extends Controller {
    protected model: Image

    @Authenticate()
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

    @Authenticate()
    public async show(id: ObjectId) {
        this.model = await Image.find(id)
        const {collection, ...entity} = this.model
        if (this.model) {
            this.respond(Status.Ok, entity)
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    @Authenticate({returnUser: true})
    public async create(token: TokenPayload) {
        const body = await this.parseBody()
        this.model = new Image(body.album, body.originalName, new ObjectId(token.id), null, "original",
            [
                {
                    status: "original",
                    timestamp: Timestamp.now()
                }
            ]
        )
        const result = await this.model.save() as InsertOneResult<Document>
        const extension = this.model.originalName.split(".").pop().replace('jpg', 'jpeg')
        this.model.url = `${ApplicationConfig.FILE_STORAGE + result.insertedId}.${extension}`
        this.model.id = result.insertedId
        await this.model.save()
        this.respond(Status.Created, {message: `Created image ${result.insertedId}`})
    }

    @Authenticate()
    public async update(id: ObjectId) {
        const body = await this.parseBody()
        this.model = await Image.find(id)
        if (this.model) {
            this.model.album = body.album || this.model.album
            this.model.originalName = body.originalName || this.model.originalName
            this.model.tags = body.tags ?? this.model.tags
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

    @Authenticate()
    public async destroy(id: ObjectId) {
        this.model = await Image.find(id)
        if (this.model) {
            await this.model.destroy()
            this.respond(Status.Ok, {message: `Deleted image ${id}`})
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    @Authenticate()
    public async metadata(id: ObjectId) {
        try {
            this.model = await Image.find(id)
            try {
                const meta = await sharp(this.model.url).metadata()
                this.respond(Status.Ok, meta)
            } catch (err) {
                this.respond(Status.InternalServerError, {message: err})
            }
        } catch (err) {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }

    @Authenticate()
    public async filter(id: ObjectId) {
        const body = await this.parseBody()
        const filter: Filter = body.filter
        const options = body.options
        this.model = await Image.find(id)
        if (this.model) {
             try {
                 await this.model[filter](options)
                 this.model.history = [
                     ...this.model.history,
                     {
                         status: filter,
                         timestamp: Timestamp.now()
                     }
                 ]
                 this.model.lastChange = filter
                 await this.model.save()
                 this.respond(Status.Ok, {message: `Applied filter ${filter} to image ${id}`})
             } catch (err) {
                 this.respond(Status.BadRequest, {message: err})
             }
        } else {
            this.respond(Status.NotFound, {message: `Image ${id} not found`})
        }
    }
}
