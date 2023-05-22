import { createRequire } from 'module'
import { VoidCallback } from "../util/types.ts"
import Colors, {colorLog} from "../util/colors.ts"

const require = createRequire(import.meta.url)

//region [ Interfaces ]
/**
 * Route interface
 * @see {@link Action}
*/
interface Route {
    path: string
    method: string
    routes: Route[]
    to?: string
}

/**
 * Action interface for matched routes
 * Generated from {@link Route.to} property
 * @see {@link Route}
 */
interface Action extends Route {
    controller: string
    action: string
}

/**
 * Route options interface
 */
interface RouteOptions {
    to?: string
    as?: string
}

/**
 * Resources options interface for {@link Router.resources} method
 */
interface ResourcesOptions {
    only: string[]
}
//endregion

//region [ Router ]
/**
 * Router class meant for generating routes tree.
 * @remarks Used only in {@link routes} function
 * @class
 * @see {@link routes}
 * @see {@link Route}
 */
export default class Router {
    private routes = []

    private currentNamespace = ''

    //region [ Helper Methods ]
    /**
     * Draws branch for current namespace
     * @returns {string} Branch string
     * @see {@link currentNamespace}
     * @see {@link namespace}
     * @private
     */
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

    /**
     * Adds route to routes tree
     * @param {Route} route
     * @see {@link Route}
     * @example
     * this.addRoute({ path: 'profile', method: 'GET', to: 'users#show' })
     * @private
     */
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

    //region [ Public Methods ]
    /**
     * Creates namespace for routes
     * @remarks Namespace is a way to group routes
     * @param {string} path
     * @param {VoidCallback} callback
     * @example
     * router.namespace('api', () => {
     *    router.namespace('v1', () => {
     *    router.resources('posts', { only: ['index', 'show'] })
     *    })
     * })
     * @public
     * @see {@link resources}
     * @see {@link get}
     * @see {@link post}
     * @see {@link put}
     * @see {@link patch}
     * @see {@link delete}
     */
    public namespace(path: string, callback: VoidCallback): void {
        colorLog(`${this.drawBranch()} NAMESPACE ${path}`, Colors.fgWhite)
        this.addRoute({ path, method: 'NAMESPACE', routes: [] })
        this.currentNamespace = this.currentNamespace == '' ? path : `${this.currentNamespace}/${path}`
        callback()
        this.currentNamespace = ''
    }

    /**
     * Creates a set of routes for a RESTful resource
     * @remarks This method can generate routes for index, show, create, update and destroy actions
     *
     * If no options are provided, all routes will be generated
     * @param {string} path
     * @param {ResourcesOptions} options
     * @example Generates routes for index and show actions
     * router.resources('posts', { only: ['index', 'show'] })
     * @public
     * @see {@link ResourcesOptions}
     * @see {@link Route}
     */
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
    /**
     * Creates GET route
     * @param {string} path
     * @param {RouteOptions} options
     * @example
     * router.get('profile', {to: 'users#show', as: 'profile'})
     * @public
     * @see {@link RouteOptions}
     * @see {@link namespace}
     * @see {@link post}
     */
    public get(path: string, options): void {
        colorLog(`${this.drawBranch()} GET ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'GET', routes: [], ...options })
    }

    /**
     * Creates POST route
     * @param {string} path
     * @param {RouteOptions} options
     * @example
     * router.post('login', {to: 'sessions#create', as: 'login'})
     * @public
     * @see {@link RouteOptions}
     * @see {@link namespace}
     * @see {@link get}
     */
    public post(path: string, options): void {
        colorLog(`${this.drawBranch()} POST ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'POST', routes: [], ...options })
    }

    /**
     * Creates PUT route
     * @param {string} path
     * @param {RouteOptions} options
     * @example
     * router.put('profile', {to: 'users#update', as: 'profile'})
     * @public
     * @see {@link RouteOptions}
     * @see {@link namespace}
     */
    public put(path: string, options): void {
        colorLog(`${this.drawBranch()} PUT ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'PUT', routes: [], ...options })
    }

    /**
     * Creates PATCH route
     * @param {string} path
     * @param {RouteOptions} options
     * @example
     * router.patch('profile', {to: 'users#update', as: 'profile'})
     * @public
     * @see {@link RouteOptions}
     * @see {@link namespace}
     */
    public patch(path: string, options): void {
        colorLog(`${this.drawBranch()} PATCH ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'PATCH', routes: [], ...options })
    }

    /**
     * Creates DELETE route
     * @param {string} path
     * @param {RouteOptions} options
     * @example
     * router.delete('profile', {to: 'users#destroy', as: 'profile'})
     * @public
     * @see {@link RouteOptions}
     * @see {@link namespace}
     */
    public delete(path: string, options): void {
        colorLog(`${this.drawBranch()} DELETE ${path}`, Colors.fgCyan)
        this.addRoute({ path, method: 'DELETE', routes: [], ...options })
    }
    //endregion
    /**
     * Matches route by path and method
     *
     * Returns {@link Action} or null if no route was found
     * @remarks This method is used by server to match routes
     * @param {string} path
     * @param {string} method
     * @returns {Action | null}
     * @public
     * @see {@link Action}
     */
    public match(path: string, method: string): Action | null {

        for (const route of this.routes) {

        }

        return null
    }
    //endregion
}
//endregion
