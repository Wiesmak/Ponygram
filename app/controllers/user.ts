import Controller from "../../util/controller"

export default class User extends Controller {
    public async index() {
        this.status(200)
        this.res.end('Hello from User#index')
    }

    public async show() {
        this.status(200)
        this.res.end('Hello from User#show')
    }
}