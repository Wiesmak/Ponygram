import {ObjectId} from "mongodb"

export default class Validate {
    static uuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    }

    static objectId(value: string): boolean {
        return ObjectId.isValid(value)
    }
}
