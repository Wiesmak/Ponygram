import http from 'http'
import URL from 'url'

import Colors, { colorLog } from "./util/colors.js"

import routes from './config/routes.js'
import ApplicationConfig from './config/application.js'

const server = http.createServer(async (req, res) => {
    colorLog(`Request received.`, Colors.fgGreen)

    const {pathname} = new URL.URL(req.url, `http://${req.headers.host}`)
    const method = req.method.toUpperCase()
    const action = routes().match(pathname, method)

    console.log({
        pathname: pathname,
        method: method,
        action: action
    })

    if (!action) {
        colorLog(`Action ${pathname} not found!`, Colors.fgRed)
        res.writeHead(404, {
            'content-type': 'application/json'
        })
        res.end(JSON.stringify({error: 'Not found'}))
        return
    }

    const {controller, action: actionName, params} = action
    const ControllerClass = await import(`./app/controllers/${controller}.js`)
    const controllerInstance = new ControllerClass.default(req, res, params)
    controllerInstance[actionName]()
})

server.listen(ApplicationConfig.PORT, () => {
    console.log(`Server listening on port ${ApplicationConfig.PORT}`)
})