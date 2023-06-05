import Controller from "../../lib/controller.ts"
import User from "../models/User.ts"
import Hash from "../../util/hash.ts"
import Status from "../../util/status.ts"
import Token from "../../util/token.ts"

export default class UsersController extends Controller {
    model: User

    public async create() {
        const body = await this.parseBody()
        // search for existing user
        if (await User.findBy('username', body.username)) {
            this.respond(Status.Conflict, {error: 'Username already exists'})
        } else if (await User.findBy('email', body.email)) {
            this.respond(Status.Conflict, {error: 'Email already exists'})
        } else {
            const hash = await Hash.encrypt(body.password)
            this.model = new User(body.username, body.email, hash, null, null)
            await this.model.save()
            const {password, collection, ...user} = this.model
            this.respond(Status.Created, user)
        }
    }

    public async login() {
        const body = await this.parseBody()
        if (body.username) {
            this.model = await User.findBy('username', body.username)
        } else if (body.email) {
            this.model = await User.findBy('email', body.email)
        } else {
            this.respond(Status.Unauthorized, {error: 'Invalid credentials'})
            return
        }
        if (this.model) {
            if (await Hash.compare(body.password, this.model.password)) {
                const token = await Token.generate(this.model)
                this.respond(Status.Ok, {token})
            } else {
                this.respond(Status.Unauthorized, {error: 'Invalid credentials'})
            }
        } else {
            this.respond(Status.Unauthorized, {error: 'Invalid credentials'})
        }
    }

    public async confirm() {
        this.respond(Status.NotImplemented, {error: 'Method not implemented'})
    }
}
