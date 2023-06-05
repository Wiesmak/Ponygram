import {VoidCallback} from "../util/types.ts"
import Colors, {colorLog} from "../util/colors.ts"
import Validate from "../util/validate.ts"
import {ObjectId} from "mongodb"

//region [ Interfaces ]
/**
 * Represents a route in an application.
 * @interface Route
 * @property {string} path - The path of the route.
 * @property {string} method - The HTTP method associated with the route.
 * @property {Route[]} routes - An array of sub-routes for the current route.
 * @property {string | undefined} to - The destination of the route, if any.
 * @remarks This interface is used only in {@link Router} class.
 * @example
 * const route: Route = {
 *  path: '/api',
 *  method: 'GET',
 *  routes: [
 *      { path: '/users', method: 'GET', routes: [], to: 'UserController.index' },
 *      { path: '/users/:id', method: 'GET', routes: [], to: 'UserController.show' }
 *  ]
 * };
 * @see Action
 */
interface Route {
    path: string
    method: string
    routes: Route[]
    to?: string
}

/**
 * Represents an action matched by a route.
 * @interface Action
 * @extends Route
 * @property {string} controller - The controller responsible for handling the action.
 * @property {string} action - The name of the action within the controller.
 * @property {object} params - Additional parameters for the action.
 * @remarks This interface extends {@link Route} interface.
 * @example
 * const action: Action = {
 *    path: '/api/users',
 *    method: 'GET',
 *    routes: [],
 *    to: 'UserController.index',
 *    controller: 'UserController',
 *    action: 'index',
 *    params: { sort: 'asc' }
 *    };
 * @see Router
 */
interface Action extends Route {
    controller: string
    action: string
    params: object
    id?: ObjectId
}

/**
 * Represents options for a route.
 * @interface RouteOptions
 * @property {string | undefined} to - The destination of the route, if any.
 * @property {string | undefined} as - An alias for the route, if any.
 * @remarks This interface is used only in {@link Router} class.
 * @example
 * const options: RouteOptions = {
 *     to: 'UserController.index',
 *     as: 'userList'
 * };
 * const route: Route = {
 *     path: '/api/users',
 *     method: 'GET',
 *     routes: [],
 *     ...options
 * };
 */
interface RouteOptions {
    to?: string
    as?: string
}

/**
 * Represents options for defining resource routes.
 * @interface ResourcesOptions
 * @property {string[]} only - An array of specific resource actions to include.
 * @remarks
 * The ResourcesOptions interface defines options for configuring resource routes.
 * The only property is an array that specifies the specific resource actions to include.
 * Valid values for only are 'index', 'show', 'create', 'update', 'destroy', 'new', and 'edit'.
 * Each action should appear only once in the only array to avoid repetitions.
 * @example
 * const options: ResourcesOptions = {
 *    only: ['index', 'show', 'create', 'update', 'destroy']
 * };
 */
interface ResourcesOptions {
    only: string[]
    as?: string
}
//endregion

//region [ Router ]
/**
 * Router class meant for generating routes tree.
 * @remarks Used only in {@link routes} function
 * @class Router
 * @property {Route[]} routes - A root array of routes.
 * @property {string} currentNamespace - Temporary variable used when generating routes tree.
 * @method {Route} namespace - Creates a new namespace for routes.
 * @method {Route} resources - Creates a set of routes.
 * @method {Route} get - Creates a new GET route.
 * @method {Route} post - Creates a new POST route.
 * @method {Route} put - Creates a new PUT route.
 * @method {Route} patch - Creates a new PATCH route.
 * @method {Route} delete - Creates a new DELETE route.
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
                    branch += '    └───'
                } else if (index == 0) {
                    branch = '│   '
                } else {
                    branch += '    '
                }
            })
        } else {
            branch = '│   └───'
        }
        return branch
    }

    /**
     * Adds route to routes tree
     * @param {Route} route - {@link Route} object to add
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
     * @param {string} path - Namespace path
     * @param {VoidCallback} callback - Callback function with routes
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
     * @param {string} path - Routes path
     * @param {ResourcesOptions} [options] - Options for routes generation ({@link ResourcesOptions.only})
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
                        this.addRoute({ path: options.as ?? path, method: 'GET', routes: [], to: `${path}#index` })
                        break
                    case 'show':
                        this.addRoute({ path: `${options.as ?? path}/:id`, method: 'GET', routes: [], to: `${path}#show` })
                        break
                    case 'create':
                        this.addRoute({ path: options.as ?? path, method: 'POST', routes: [], to: `${path}#create` })
                        break
                    case 'update':
                        this.addRoute({ path: `${options.as ?? path}/:id`, method: 'PUT', routes: [], to: `${path}#update` })
                        break
                    case 'destroy':
                        this.addRoute({ path: `${options.as ?? path}/:id`, method: 'DELETE', routes: [], to: `${path}#destroy` })
                        break
                    case 'new':
                        this.addRoute({ path: `${options.as ?? path}/new`, method: 'GET', routes: [], to: `${path}#new` })
                        break
                    case 'edit':
                        this.addRoute({ path: `${options.as ?? path}/:id/edit`, method: 'GET', routes: [], to: `${path}#edit` })
                        break
                }
            })
        }
    }

    //region [ HTTP Methods ]
    /**
     * Creates GET route
     * @param {string} path - Request path
     * @param {RouteOptions} options - Route options ({@link Route.to}, {@link Route.as})
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
     * @param {string} path - Request path
     * @param {RouteOptions} options - Route options ({@link Route.to}, {@link Route.as})
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
     * @param {string} path - Request path
     * @param {RouteOptions} options - Route options ({@link Route.to}, {@link Route.as})
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
     * @param {string} path - Request path
     * @param {RouteOptions} options - Route options ({@link Route.to}, {@link Route.as})
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
     * @param {string} path - Request path
     * @param {RouteOptions} options - Route options ({@link Route.to}, {@link Route.as})
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
     * @param {string} path - Request path
     * @param {string} method - Request method
     * @returns {Action | null}
     * @public
     * @see {@link Action}
     */
    public match(path: string, method: string): Action | null {
        const pathParts = path.split('/').filter(part => part !== '')
        let currentRoute: Route = null
        let id: ObjectId = null
        if (Validate.objectId(pathParts.at(-1))) {
            id = pathParts.pop() as ObjectId
        }
        for (const route of pathParts) {
            if (id !== null && route === pathParts.at(-1)) {
                currentRoute = currentRoute === null
                    ? this.routes.find(r => r.path === `${route}/:id` && r.method === method)
                    : currentRoute.routes.find(r => r.path === `${route}/:id` && r.method === method)
                continue
            }
            currentRoute = currentRoute == null
                ? this.routes.find(r => r.path === route && (r.method === method || r.method === 'NAMESPACE') )
                : currentRoute.routes.find(r => r.path === route && (r.method === method || r.method === 'NAMESPACE'))
        }

        return currentRoute == null ? null : {
            controller: currentRoute.to.split('#')[0],
            action: currentRoute.to.split('#')[1],
            params: currentRoute.path.split('/').filter(part => part !== '').map((part, index) => {
                if (part.startsWith(':')) {
                    return { name: part.slice(1), value: pathParts[index] }
                }
            }).filter(part => part !== undefined),
            id,
            ...currentRoute
        }
    }
    //endregion
}
//endregion
