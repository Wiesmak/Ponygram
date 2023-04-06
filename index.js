import http2 from 'http2'
import URL from 'url'

import routes from './config/routes.js'
import ApplicationConfig from './config/application.js'

const server = http2.createServer(async (req, res) => {
    const {pathname} = new URL.URL(req.url, `http://${req.headers.host}`)
    const method = req.method.toUpperCase()
    const action = routes().match(pathname, method)

    if (!action) {
        res.writeHead(404)
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