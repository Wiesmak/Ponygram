import Controller from "../../lib/controller.ts"
import Profile from "../models/Pofile.ts"
import Status from "../../util/status.ts"
import Authenticate from "../../lib/authenticate.ts"
import {TokenPayload} from "../../util/types.ts"
import {ObjectId} from "mongodb"
import User from "../models/User.ts"
import File from "../models/File.ts"

export default class ProfilesController extends Controller {
    @Authenticate({ returnUser: true })
    public async show(token: TokenPayload) {
        const user = await Profile.find(new ObjectId(token.id))
        if (user) {
            this.respond(Status.Ok, {
                username: user.username,
                email: user.email,
                id: token.id
            })
        } else {
            this.respond(Status.Unauthorized, { error: 'Unauthorized' })
        }
    }

    @Authenticate({ returnUser: true })
    public async update(token: TokenPayload) {
        const user = await User.find(new ObjectId(token.id))
        if (user) {
            const body = await this.parseBody()
            if (body.username && body.email) {
                user.username = body.username
                user.email = body.email
                await user.save()
                this.respond(Status.Ok, user)
            } else {
                this.respond(Status.BadRequest, { error: 'Missing username or email' })
            }
        }
    }

    @Authenticate({ returnUser: true })
    public async updatePicture(token: TokenPayload) {
        const file = await File.parse(this.req)
        try {
            let extension = (await this.parseFileName()).split('.').pop()
            if (extension === 'jpg') extension = 'jpeg'
            const fileName = `${token.id}.${extension}`
            await file.save(`profile/${fileName}`)
            const user = await User.find(new ObjectId(token.id))
            user.profilePicture = fileName
            await user.save()
            this.respond(Status.Created, { message: `File ${fileName} uploaded` })
        } catch (err) {
            if (err === 'No file name provided')
                this.respond(Status.BadRequest, { message: err })
            else
                this.respond(Status.InternalServerError, { message: err })
        }
    }

    @Authenticate({ returnUser: true })
    public async getPicture(token: TokenPayload) {
        try {
            const type = await User.find(new ObjectId(token.id)).then(user => user.profilePicture.split('.').pop())
            try {
                const file = await File.read(`profile/${token.id}.${type}`)
                this.res.statusCode = Status.Ok
                this.res.setHeader('Content-Type', `image/${type}`)
                this.res.setHeader('Access-Control-Allow-Origin', '*')
                this.res.setHeader('Access-Control-Request-Method', '*')
                this.res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, PUT, DELETE')
                this.res.setHeader('Access-Control-Allow-Headers', '*')
                this.res.setHeader('Access-Control-Max-Age', '2592000')
                this.res.write(file.data)
                this.res.end()
            } catch (err) {
                this.respond(Status.NotFound, { message: err })
            }
        } catch (err) {
            this.respond(Status.BadRequest, { message: err })
        }
    }
}
