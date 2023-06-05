import Model from "../../lib/model.ts"
import {db} from "../../index.ts"
import {ObjectId} from "mongodb"

export default class Profile extends Model {
    collection = db.collection("users")

    constructor(public username: string, public email: string) {
        super()
    }

    public static async find(id: ObjectId): Promise<Profile> {
        const user = await db.collection("users").findOne({_id: id})
        if (user) return new Profile(user.username, user.email)
        else return null
    }
}
