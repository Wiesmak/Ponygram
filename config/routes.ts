import Router from "../lib/router.ts"
import Colors, {colorLog} from "../util/colors.ts"

export default function routes(): Router {
    const router: Router = new Router()
    colorLog(`GENERATING ROUTES TREE`, Colors.fgYellow)

    router.namespace('api', () => {
        router.namespace('v1', () => {
            router.resources('posts', { only: ['index', 'show'] })
        })
    })
    router.namespace('app', () => {
        router.post('login', {to: 'sessions#create', as: 'login'})
    })

    router.get('profile', {to: 'users#show', as: 'profile'})

    return router
}
