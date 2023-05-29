import Controller from "../../lib/controller.ts"

export default class Photos extends Controller {
    public index() {
        this.respond(200, {message: 'Hello, world!'})
    }

    public show(id: string) {
        this.respond(200, {message: 'Hello, world!'})
    }
}