import Controller from "../../lib/controller.ts"
//import respond from "../../util/respond.ts"

export default class User extends Controller {

    //declare private respond: (code: number, body?: string | object) => void
    public async index() {
        this.respond(200, 'Hello from User#index')
    }

    public async show() {
        this.status(200)
        this.respond(200, 'Hello from User#index')
    }
}
