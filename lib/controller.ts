import {IncomingMessage, ServerResponse} from "http"

export default class Controller {
    public req: IncomingMessage
    public res: ServerResponse

    constructor(req: IncomingMessage, res: ServerResponse) {
        this.req = req
        this.res = res
    }

    protected status(code: number): void {
        this.res.statusCode = code
    }
}