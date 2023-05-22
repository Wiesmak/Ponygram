import {IncomingMessage, ServerResponse} from "http"

/**
 * Base controller class
 * @abstract
 * @class Controller
 * @see {@link Router}
 */
export default class Controller {
    /**
     * Request object
     * @public
     * @type {IncomingMessage}
     * @memberof Controller
     */
    public req: IncomingMessage
    /**
     * Response object
     * @public
     * @type {ServerResponse}
     * @memberof Controller
     */
    public res: ServerResponse

    /**
     * Creates an instance of Controller.
     * @constructor
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    constructor(req: IncomingMessage, res: ServerResponse) {
        this.req = req
        this.res = res
    }

    /**
     * Sets response status code
     * @param {number} code
     * @protected
     * @memberof Controller
     */
    protected status(code: number): void {
        this.res.statusCode = code
    }
}
