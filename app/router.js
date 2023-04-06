import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default class Router {
    constructor() {
        this.routes = []
    }

    get(path, options = {}) {
        this.routes.push({path, options})
    }

    namespace(path, callback) {
        const router = new Router()
        callback.call(router)
        this.routes.push({path, router})
    }

    resources(name, options = {}) {
        const { only = [] } = options
        const router = new Router()
        const includeAll = only.length === 0

        if (includeAll || only.includes('index')) {
            router.get('', {to: `${name}#index`})
        }

        if (includeAll || only.includes('show')) {
            router.get(':id', {to: `${name}#show`})
        }

        this.routes.push({path: name, router})
    }

    match(path, method) {
        for (const {path: routePath, router, options} of this.routes) {
            if (routePath === path && options && options.to && method === 'GET') {
                const [controllerName, actionName] = options.to.split('#')
                const controller = require(`../app/controllers/${controllerName}`)
                return controller[actionName]
            }

            if (path.startsWith(`${routePath}/`)) {
                const subPath = path.substring(routePath.length)
                return router.match(subPath, method)
            }

            return null
        }
    }
}