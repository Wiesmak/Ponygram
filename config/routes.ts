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

        router.patch('tags/:id', { to: 'tags#update', as: 'tags' })

        router.resources('images', { only: ['index', 'show', 'create', 'update', 'destroy'] })
        router.patch('images/:id', { to: 'images#filter', as: 'images' })

        router.get('profile', { to: 'profiles#show' })
        router.patch('profile', { to: 'profiles#update' })
        router.post('profile', { to: 'profiles#updatePicture' })

        router.get('picture', { to: 'profiles#getPicture' })

        router.namespace('photos', () => {
            router.get('metadata/:id', { to: 'images#metadata', as: 'metadata' })
            router.patch('tags/:id', { to: 'imageTags#replace', as: 'imageTags' })
            router.resources('imageTags', { only: ['show', 'create', 'update', 'destroy'], as: 'tags' })
        })


    })

    router.namespace('user', () => {
        router.get('info/:id', { to: 'users#show', as: 'info' })
        router.post('register', { to: 'users#create', as: 'register' })
        router.post('login', { to: 'users#login', as: 'login' })
        router.post('confirm', { to: 'users#confirm', as: 'confirm' })
    })

    router.namespace('files', () => {
        router.post('upload', { to: 'files#upload' })
        router.get('get/:id', { to: 'files#download' })
    })
    //endregion

    return router
}
