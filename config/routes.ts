import Router from "../lib/router.ts"

/**
 * Generates routes tree with Rails-like syntax
 * @returns {Router} Router instance
 * @see {@link Router}
 * @see {@link Route}
 * @remarks Write your routes here using {@link Router} methods
 * @remarks This function is called by server on request
 * @returns {Router} Router instance with generated routes tree
 * @example
 * router.namespace('api', () => {
 *    router.namespace('v1', () => {
 *        router.resources('posts', { only: ['index', 'show'] })
 *        router.post('login', {to: 'sessions#create', as: 'login'})
 *    })
 * })
 * router.get('profile', {to: 'users#show', as: 'profile'})
 */
export default function routes(): Router {
    const router: Router = new Router()

    //region [ Routes ]
    router.namespace('api', () => {
        router.resources('tags', { only: ['index', 'show', 'create', 'update', 'destroy'] })

        router.get('taglist', { to: 'tags#raw', as: 'taglist' })

        router.resources('images', { only: ['index', 'show', 'create', 'update', 'destroy'] })

        router.namespace('images', () => {
            router.resources('tags', { only: ['index', 'show', 'create', 'update', 'destroy'] })
        })
    })
    //endregion

    return router
}
