declare class Router {
    constructor()
    routes: Route[]

    get(path: string, options?: RouteOptions): void

    namespace(path: string, callback: () => void): void

    resources(path: string, options?: ResourcesOptions): void

    match(path: string, method: string): RouteMatch | null
}

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

export default Router