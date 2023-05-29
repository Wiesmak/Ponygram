import {IncomingMessage, ServerResponse} from "http"
import Colors, {colorLog} from "../util/colors.ts"
import {Status} from "../util/status.ts"

export interface ControllerInterface {
    index?(): void
    show?(id: string): void
    create?(): void
    update?(id: string): void
    destroy?(id: string): void
}

/**
 * Base controller class
 * @abstract
 * @class Controller
 * @implements {ControllerInterface}
 * @see {@link Router}
 */
export default class Controller implements ControllerInterface {
    /**
     * Sets the response code and sends the response to the client.
     * @param code - The HTTP response code.
     * @param data - The data to be sent in the response body.
     * @param headers - The additional headers to be included in the response.
     * @remarks This function is overloaded to handle different variations of the respond method. The appropriate overload should be called based on the arguments provided. If data is a string, it will be wrapped in an object with a message property.
     * @example
     * // Set the response code to 200 and send a JSON response with the provided data
     * respond(200, { message: 'Success' });
     * // Set the response code to 400 and send a JSON response with an error message
     * respond(400, 'Bad Request');
     * // Set the response code to 200, include custom headers, and send a JSON response with the provided data
     * respond(200, { message: 'Success' }, { 'X-Custom-Header': 'Value' });
     */
    protected respond: {
        (code: Status): void
        (code: Status, data: object): void
        (code: Status, data: string): void
        (code: Status, data: object, headers: object): void
    } = (code: Status, data?: object | string, headers?: object) => {
        this.res.statusCode = code
        this.res.writeHead(code, {
            ...(headers || {}),
            'content-type': 'application/json'
        })
        colorLog(`RESPOND ${code} ${data}`, code === 200 ? Colors.fgGreen : Colors.fgRed)
        this.res.end(JSON.stringify(typeof data === 'string' ? { message: data } : data))
    }
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
