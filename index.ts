import http, {IncomingMessage, ServerResponse} from 'http'
import URL from 'url'

import Colors, { colorLog } from "./util/colors.ts"

import routes from './config/routes.ts'
import ApplicationConfig from './config/application.ts'
import Database from "./lib/database.ts"
import {ObjectId} from "mongodb"

export const db = (await Database.connect()).db()

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    colorLog(`Request received.`, Colors.fgGreen)

    const {pathname} = new URL.URL(req.url, `http://${req.headers.host}`)
    const method = req.method.toUpperCase()
    colorLog(`GENERATING ROUTES TREE`, Colors.fgYellow)
    console.log('┌────────────── APP ROUTES TREE ───────────────┐')
    const action = routes().match(pathname, method)
    console.log('└──────────────────────────────────────────────┘')
    colorLog(`ROUTES TREE GENERATED`, Colors.fgYellow)

    if (!action) {
        colorLog(`Action ${pathname} not found!`, Colors.fgRed)
        res.writeHead(404, {
            'content-type': 'application/json'
        })
        res.end(JSON.stringify({error: 'Not found'}))
        return
    }

    colorLog(`MATCH ${pathname} -> ${action.controller}#${action.action}`, Colors.fgGreen)

    const {controller, action: actionName, params, id} = action
    try {
        // @ts-ignore
        const ControllerClass = await import(`./app/controllers/${controller[0].toUpperCase() + controller.slice(1)}Controller.ts`)
        const controllerInstance = new ControllerClass.default(req, res, params)
        id != null ? controllerInstance[actionName](new ObjectId(id)) : controllerInstance[actionName]()
    } catch (e) {
        colorLog(`Error while loading controller ${controller}!`, Colors.fgRed)
        console.error(e)
        res.writeHead(500, {
            'content-type': 'application/json'
        })
        res.end(JSON.stringify({error: 'Internal server error'}))
    }
})

server.listen(ApplicationConfig.PORT, () => {
    console.log(`Server listening on port ${ApplicationConfig.PORT}`)
})
