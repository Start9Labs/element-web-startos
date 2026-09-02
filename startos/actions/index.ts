import { sdk } from '../sdk'
import { configureDefaultHomeserver } from './configureDefaultHomeserver'

export const actions = sdk.Actions.of().addAction(configureDefaultHomeserver)
