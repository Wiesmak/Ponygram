import Controller from "../../lib/controller.ts"
import File from "../../lib/file.ts"
import Status from "../../util/status.ts"

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
}
