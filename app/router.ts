import { createRequire } from 'module'
import { VoidCallback } from "../util/types"

const require = createRequire(import.meta.url)

interface Path {
    path: string
    method?: string
    routes?: Path[]
}

interface Namespace extends Path {
    routes: Path[]
}

interface Route extends Path {
    controller: string
    action: string
    method: string
}

type RouteOptions = {
    to: string
    as?: string
}

type RouteMatch = {
    controller: string
    action: string
}

export default class Router {
    private routes: Path[] = []

    public namespace(path: string, callback: VoidCallback): void {}

    public resources (path: string, options: { only: string[] }): void {}

    public get(path: string, options: RouteOptions): void {
        if (options.to !== undefined) {
            const [controller, action] = options.to.split('#')
            const route: Route = {
                path: options.as || path,
                method: 'GET',
                controller: controller,
                action: action,
            }
            this.routes.push(route)
        }
    }

    public match(path: string, method: string): RouteMatch | null {
        console.table(this.routes)

        for (const route of this.routes) {
            if (route.path === path && route.method === method) {
                if (route.method !== undefined) {
                    const match = route as Route
                    return {
                        controller: match.controller,
                        action: match.action,
                    }
                }
            }
        }

        return null
    }
}
