import Colors, {colorLog} from "./colors.ts"

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
const respond: {
    (code: number): void
    (code: number, data: object): void
    (code: number, data: string): void
    (code: number, data: object, headers: object): void
} = (code: number, data?: object | string, headers?: object) => {
    this.res.statusCode = code
    this.res.writeHead(code, {
        ...(headers || {}),
        'content-type': 'application/json'
    })
    colorLog(`RESPOND ${code} ${data}`, code === 200 ? Colors.fgGreen : Colors.fgRed)
    this.res.end(JSON.stringify(typeof data === 'string' ? { message: data } : data))
}

export default respond