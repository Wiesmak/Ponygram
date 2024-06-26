import Model from "../../lib/model.ts"
import {db} from "../../index.ts"
import {ObjectId} from "mongodb"

export default class User extends Model {
    collection = db.collection('users')

    constructor(
        public username: string,
        public email: string,
        public password: string,
        public confirmed: boolean,
        public profilePicture?: string,
        public id?: ObjectId
    ) {
        super(id)
    }

    public static async findBy(field: string, value: string): Promise<User | null> {
        const user = await db.collection('users').findOne({[field]: value})
        if (user) {
            return new User(user.username, user.email, user.password, user.confirmed, user.profilePicture, user._id)
        }
        return null
    }

    public static async find(id: ObjectId): Promise<User | null> {
        const user = await db.collection('users').findOne({_id: id})
        if (user) {
            return new User(user.username, user.email, user.password, user.confirmed, user.profilePicture, user._id)
        }
        return null
    }
}
