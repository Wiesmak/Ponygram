import Controller from "../../lib/controller.ts"
import Status from "../../util/status.ts"

export default class ImagesController extends Controller {
    public index() {
        this.respond(Status.Ok, {message: 'Hello, world!'})
    }

    public show(id: string) {
        this.respond(Status.Ok, {message: `Hello, ${id ?? 'world'}!`})
    }
}
