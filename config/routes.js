import Router from "../app/router.js"

export default function routes() {
    const router = new Router()

    router.namespace('api', () => {
        router.namespace('v1', () => {
            router.resources('posts', { only: ['index', 'show'] })
        })
    })
    router.get('profile', {to: 'users#show', as: 'profile'})

    return router
}
