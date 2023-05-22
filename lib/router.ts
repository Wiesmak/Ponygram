import { createRequire } from 'module'
import { VoidCallback } from "../util/types.ts"
import Colors, {colorLog} from "../util/colors.ts"

const require = createRequire(import.meta.url)

//region [ Interfaces ]
interface Route {
    path: string
    method: string
    routes: Route[]
    to?: string
}

interface Action extends Route {
    controller: string
    action: string
}

interface RouteOptions {
    to?: string
    as?: string
}

interface ResourcesOptions {
    only: string[]
}
//endregion

//region [ Router ]
export default class Router {
    private routes = []

    private currentNamespace = ''

    //region [ Helper Methods ]
    private drawBranch(): string {
        let branch = ''
        if (this.currentNamespace == '') {
            branch = '├───'
        } else if (this.currentNamespace.includes('/')) {
            const namespaceArr = this.currentNamespace.split('/')
            namespaceArr.forEach((namespace, index) => {
                if (index == namespaceArr.length -1) {
                    branch = '└───'
                } else {
                    branch = '│   '
                }
            })
        } else {
            branch = '│   └───'
        }
        return branch
    }

    private addRoute(route: Route): void {
        if (this.currentNamespace == '') {
            this.routes.push(route)
        } else if (this.currentNamespace.includes('/')) {
            const namespaceArr = this.currentNamespace.split('/')
            const path = this.routes.find(route => route.path == namespaceArr[0])
            namespaceArr.shift()
            namespaceArr.forEach((namespace, index) => {
                if (index == namespaceArr.length) {
                    path.routes.push(route)
                } else {
                    path.routes.find(route => route.path == namespace).routes.push(route)
                }
            })
        } else {
            this.routes.find(route => route.path == this.currentNamespace).routes.push(route)
        }
    }
    //endregion

    public namespace(path: string, callback: VoidCallback): void {

        colorLog(`${this.drawBranch()} NAMESPACE ${path}`, Colors.fgWhite)
        this.addRoute({ path, method: 'NAMESPACE', routes: [] })
        this.currentNamespace = this.currentNamespace == '' ? path : `${this.currentNamespace}/${path}`
        callback()
        this.currentNamespace = ''
    }

    public resources(path: string, options?: ResourcesOptions): void {
        colorLog(`${this.drawBranch()} RESOURCES ${path}`, Colors.fgCyan)
        if (options !== undefined) {
            options.only.forEach(action => {
                switch (action) {
                    case 'index':
                        this.addRoute({ path, method: 'GET', routes: [], to: `${path}#index` })
                        break
                    case 'show':
                        this.addRoute({ path: `${path}/:id`, method: 'GET', routes: [], to: `${path}#show` })
                        break
                    case 'create':
                        this.addRoute({ path, method: 'POST', routes: [], to: `${path}#create` })
                        break
                    case 'update':
                        this.addRoute({ path: `${path}/:id`, method: 'PUT', routes: [], to: `${path}#update` })
                        break
                    case 'destroy':
                        this.addRoute({ path: `${path}/:id`, method: 'DELETE', routes: [], to: `${path}#destroy` })
                        break
                    case 'new':
                        this.addRoute({ path: `${path}/new`, method: 'GET', routes: [], to: `${path}#new` })
                        break
                    case 'edit':
                        this.addRoute({ path: `${path}/:id/edit`, method: 'GET', routes: [], to: `${path}#edit` })
                        break
                }
            })
        }
    }

    //region [ HTTP Methods ]
    public get(path: string, options): void {
        colorLog(`${this.drawBranch()} GET ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'GET', routes: [], ...options })
    }

    public post(path: string, options): void {
        colorLog(`${this.drawBranch()} POST ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'POST', routes: [], ...options })
    }

    public put(path: string, options): void {
        colorLog(`${this.drawBranch()} PUT ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'PUT', routes: [], ...options })
    }

    public patch(path: string, options): void {
        colorLog(`${this.drawBranch()} PATCH ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'PATCH', routes: [], ...options })
    }

    public delete(path: string, options): void {
        colorLog(`${this.drawBranch()} DELETE ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'DELETE', routes: [], ...options })
    }
    //endregion
    public match(path: string, method: string) {

        for (const route of this.routes) {

        }

        return null
    }
}
//endregion
