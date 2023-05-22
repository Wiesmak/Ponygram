export default class UsersController {
    constructor(private req: Request, private res: Response, private params: { [key: string]: string }) {}
    async show() {
        // @ts-ignore
        this.res.end(JSON.stringify({message: 'Hello world!'}))
    }
}
