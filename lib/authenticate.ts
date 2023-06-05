import {IncomingMessage, ServerResponse} from "http"
import Token from "../util/token.ts"
import {TokenPayload} from "../util/types.ts"

type AuthenticateOptions = { returnUser?: boolean }

export default function Authenticate(options?: AuthenticateOptions) {
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
                    const decoded: TokenPayload = {id: result.id, username: result.username, email: result.email, confirmed: result.confirmed}
                    if (options?.returnUser) args.push(decoded)
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
