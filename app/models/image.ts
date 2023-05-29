import Model from "../../lib/model.ts"
import {Status, UUID} from "../../util/types.ts"

export default class Image extends Model {
    constructor(
        public id: UUID,
        public album: string,
        public originalName: string,
        public url: string,
        public lastChange: Status,
        public history: Status[]
    ) {
        super(id)
    }
}
