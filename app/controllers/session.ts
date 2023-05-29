import Controller from "../../lib/controller.ts"

export default class Session extends Controller {
    public async create() {
        this.respond(200, 'Hello from Session#create')
    }
}
