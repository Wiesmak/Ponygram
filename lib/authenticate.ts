import {IncomingMessage, ServerResponse} from "http"
import Token from "../util/token.ts"

export default function Authenticate() {
    return function (target: object) {
        return function (...args: any[]) {
            const req: IncomingMessage = this.req
            const res: ServerResponse = this.res
            if (!req.headers.authorization) {
                res.statusCode = 401
                res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"')
                res.write(JSON.stringify({message: 'Unauthorized'}))
                res.end()
                return
            }

            const auth = req.headers.authorization.split(' ')[1]

            try {
                Token.verify(auth).then((result) => {
                    const decoded = {id: result.id, username: result.username, verified: result.verified}
                    return target.apply(this, args)
                }).catch((err) => {
                    res.statusCode = 401
                    res.write(JSON.stringify({message: 'Unauthorized'}))
                    res.end()
                    return
                })
            } catch (err) {
                res.statusCode = 401
                res.write(JSON.stringify({message: 'Unauthorized'}))
                res.end()
                return
            }
        }
    }
}
