import {IncomingMessage, ServerResponse} from "http"
import Colors, {colorLog} from "../util/colors.ts"
import Status from "../util/status.ts"
import Model from "./model.ts"
import {ObjectId} from "mongodb"

export interface ControllerInterface {
    index?(): void
    show?(id: ObjectId): void
    create?(): void
    update?(id: ObjectId): void
    destroy?(id: ObjectId): void
}

/**
 * Base controller class
 * @abstract
 * @class Controller
 * @implements {ControllerInterface}
 * @see {@link Router}
 * @see {@link Model}
 * @example
 * class ImagesController extends Controller {
 *   public index() {
 *      this.model = Image.all()
 *      this.respond(Status.Ok, this.model)
 *   }
 * }
 */
export default abstract class Controller implements ControllerInterface {
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
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PATCH, PUT, DELETE',
            'Access-Control-Allow-Headers': '*',
            'content-type': 'application/json'
        })
        colorLog(`RESPOND ${code} ${data}`, (code >= 200 && code <= 208) ? Colors.fgGreen : Colors.fgRed)
        this.res.end(JSON.stringify(typeof data === 'string' ? { message: data } : data))
    }
    /**
     * Request object
     * @public
     * @type {IncomingMessage}
     * @memberof Controller
     */
    protected req: IncomingMessage
    /**
     * Response object
     * @public
     * @type {ServerResponse}
     * @memberof Controller
     */
    protected res: ServerResponse
    /**
     * Entity model
     * @remarks Model class must be extended from {@link Model}
     * @protected
     * @type {Model}
     * @memberof Controller
     * @see {@link Model}
     * @example
     * // Get all users
     * this.model.all()
     * // Create a new user
     * this.model.create({name: 'John Doe'})
     * // Find a user by id
     * this.model.find(1)
     * // Save a model to the database
     * this.model.save()
     */
    protected model: Model
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

    protected parseBody(): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = ''
            this.req.on('data', (chunk) => {
                body += chunk.toString()
            })
            this.req.on('end', () => {
                try {
                    resolve(JSON.parse(body))
                } catch (err) {
                    reject(err)
                }
            })
            this.req.on('error', (err) => {
                reject(err)
            })
        })
    }

    protected parseFile(): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = []
            this.req.on('data', (chunk) => {
                chunks.push(chunk)
            })
            this.req.on('end', () => {
                try {
                    const fileData = Buffer.concat(chunks)
                    resolve(fileData)
                } catch (err) {
                    reject(err)
                }
            })
            this.req.on('error', (err) => {
                reject(err)
            })
        })
    }

    protected parseFileName(): Promise<string> {
        return new Promise((resolve, reject) => {
            const disposition = this.req.headers['content-disposition']
            if (disposition) {
                const match = disposition.match(/filename="(.+)"/)
                if (match) {
                    resolve(match[1])
                } else {
                    reject('No filename provided')
                }
            }
        })
    }

    protected parseFileExtension(): Promise<string> {
        return new Promise((resolve, reject) => {
            const accept = this.req.headers['accept']
            if (accept) {
                const match = accept.match(/image\/(.+)/)
                if (match) {
                    resolve(match[1])
                } else {
                    reject('No file extension provided')
                }
            } else {
                reject('No file extension provided')
            }
        })
    }
}
