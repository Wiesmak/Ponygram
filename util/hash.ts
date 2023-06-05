import bcrypt from 'bcryptjs'

export default class Hash {
    static encrypt: (password: string) => Promise<string> = (password: string) =>
        new Promise((resolve, reject) => {
            bcrypt.hash(password, 10)
                .then((hash: string) => resolve(hash))
                .catch((err: Error) => reject(err))
        }
    )

    static compare: (password: string, hash: string) => Promise<boolean> = (password: string, hash: string) =>
        new Promise((resolve, reject) => {
            bcrypt.compare(password, hash)
                .then((res: boolean) => resolve(res))
                .catch((err: Error) => reject(err))
        }
    )
}

