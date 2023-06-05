import Controller from "../../lib/controller.ts"
import File from "../models/File.ts"
import Status from "../../util/status.ts"
import {ObjectId} from "mongodb"

export default class FilesController extends Controller {
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

    public async download(id: ObjectId) {
        try {
            const type = await this.parseFileExtension()
            try {
                const file = await File.read(`${id.toHexString()}.${type}`)
                this.res.statusCode = Status.Ok
                this.res.setHeader('Content-Type', `image/${type}`)
                this.res.end(file.data)
            } catch (err) {
                this.respond(Status.NotFound, {message: err})
            }
        } catch (err) {
            this.respond(Status.BadRequest, {message: err})
        }
    }
}
