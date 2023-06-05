import {IncomingMessage} from "http"
import fs from "fs"
import ApplicationConfig from "../config/application.ts"

export default class File {
    data: Buffer

    constructor(data: Buffer) {
        this.data = data
    }

    static async parse(req: IncomingMessage): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            const chunks: Buffer[] = []
            req.on('data', (chunk) => {
                chunks.push(chunk)
            })
            req.on('end', () => {
                try {
                    resolve(new File(Buffer.concat(chunks)))
                } catch (err) {
                    reject(err)
                }
            })
            req.on('error', (err) => {
                reject(err)
            })
        })
    }

    async save(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.promises.writeFile(ApplicationConfig.FILE_STORAGE + path, this.data)
                .then(() => resolve())
                .catch(err => reject(err))
        })
    }

    async delete(path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.promises.unlink(ApplicationConfig.FILE_STORAGE + path)
                .then(() => resolve())
                .catch(err => reject(err))
        })
    }

    async read(path: string): Promise<File> {
        return new Promise<File>((resolve, reject) => {
            fs.promises.readFile(ApplicationConfig.FILE_STORAGE + path)
                .then(data => resolve(new File(data)))
                .catch(err => reject(err))
        })
    }
}
