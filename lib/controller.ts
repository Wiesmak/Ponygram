import {IncomingMessage, ServerResponse} from "http"

/**
 * Base controller class
 * @abstract
 * @class Controller
 * @see {@link Router}
 */
export default class Controller {
    /**
     * Represents the respond method.
     * @method respond
     * @param {number} code - The HTTP response code.
     * @param {string | object | undefined} body - The response body, which can be a string or an object.
     * @param {object | undefined} headers - The additional headers to be included in the response.
     * @returns {void}
     * @example
     * import('../util/respond.ts').then((module) => {
     *     his.respond = module.default.bind(this)
     * )
     */
    protected respond: (code: number, body?: string | object, headers?: object) => void
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
        import('../util/respond.ts').then((module) => {
          this.respond = module.default.bind(this)
        })
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
