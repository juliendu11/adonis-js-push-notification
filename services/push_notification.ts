import app from '@adonisjs/core/services/app'
import { PushNotificationCore } from '../src/types/main.js'

let pushNotification: PushNotificationCore

await app.booted(async () => {
  pushNotification = await app.container.make('pushNotification')
})

export { pushNotification as default }
