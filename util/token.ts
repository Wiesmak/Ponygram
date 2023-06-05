import jwt from 'jsonwebtoken'
import User from "../app/models/User.ts"
import ApplicationConfig from "../config/application.ts"

export default class Token {
    static generate = (user: User): Promise<string> =>
        jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            confirmed: user.confirmed
        }, ApplicationConfig.SECRET_KEY, {expiresIn: '60d'})

    static verify = (token: string): Promise<object> =>
        new Promise((resolve, reject) => {
            jwt.verify(token, ApplicationConfig.SECRET_KEY, (err, decoded) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(decoded)
                }
            })
        })
}
