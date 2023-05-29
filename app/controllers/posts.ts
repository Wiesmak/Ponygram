import Controller from "../../lib/controller.ts"

export default class Posts extends Controller {

    //declare private respond: (code: number, body?: string | object) => void
    public async index() {
        this.respond(200, 'Hello from Posts#index')
    }

    public async show() {
        this.respond(200, 'Hello from Posts#show')
    }
}
