import { createRequire } from 'module'
import { VoidCallback } from "../util/types"

const require = createRequire(import.meta.url)

type Route = {
    path: string
    options?: RouteOptions
    router?: Router
}

type RouteOptions = {
    to?: string
    as?: string
}

type ResourcesOptions = {
    only?: ('index' | 'show' | 'new' | 'create' | 'edit' | 'update' | 'destroy')[]
}

type RouteMatch = {
    controller: string
    action: string
    params: { [key: string]: string }
}

export default class Router {
    private routes: Route[]

    constructor() {
        this.routes = []
    }

    get(path: string, options: RouteOptions = {}): void {
        this.routes.push({path, options})
    }

    namespace(path: string, callback: VoidCallback): void {
        const router = new Router()
        callback.call(router)
        this.routes.push({path, router})
    }

    resources(name: string, options: ResourcesOptions = {}): void {
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

    match(path: string, method: string): RouteMatch | null {
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
