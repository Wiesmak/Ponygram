import Controller from "../../lib/controller.ts"
import File from "../models/File.ts"
import Status from "../../util/status.ts"
import {ObjectId} from "mongodb"
import Image from "../models/Image.ts"
import Authenticate from "../../lib/authenticate.ts"

export default class FilesController extends Controller {
    @Authenticate()
    public async upload() {
        const file = await File.parse(this.req)
        try {
            const fileName = await this.parseFileName()
            await file.save(fileName)
            this.respond(Status.Created, {message: `File ${fileName} uploaded`})
        } catch (err) {
            if (err === 'No file name provided')
                this.respond(Status.BadRequest, {message: err})
            else
                this.respond(Status.InternalServerError, {message: err})
        }
    }

    @Authenticate()
    public async download(id: ObjectId) {
        try {
            const type = await this.parseFileExtension()
            const imageModel = await Image.find(id)
            if (imageModel) {
                const lastChange = imageModel.lastChange
                const suffix = (lastChange.startsWith("modified") || lastChange === "original")
                    ? ''
                    : `-${lastChange}`
                try {
                    const file = await File.read(`${id.toHexString() + suffix}.${type}`)
                    this.res.statusCode = Status.Ok
                    this.res.setHeader('Access-Control-Allow-Origin', '*')
                    this.res.setHeader('Access-Control-Request-Method', '*')
                    this.res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE')
                    this.res.setHeader('Access-Control-Allow-Headers', '*')
                    this.res.setHeader('Access-Control-Max-Age', '2592000')
                    this.res.setHeader('Content-Type', `image/${type}`)
                    this.res.end(file.data)
                } catch (err) {
                    this.respond(Status.NotFound, {message: err})
                }
            } else {
                this.respond(Status.NotFound, {message: `Image ${id} not found`})
            }
        } catch (err) {
            this.respond(Status.BadRequest, {message: err})
        }
    }
}
