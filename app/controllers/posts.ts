import Controller from "../../lib/controller.ts"

export default class Posts extends Controller {
    public async index() {
        this.respond(200, 'Hello from Posts#index')
    }

    public async show(id: string) {
        this.respond(200, `Hello from Posts#show with id: ${id}`)
    }
}
