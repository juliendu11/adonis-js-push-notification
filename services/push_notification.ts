import app from '@adonisjs/core/services/app'
import { PushNotification } from '../src/push_notification.js'

let pushNotification: PushNotification

await app.booted(async () => {
  pushNotification = await app.container.make('pushNotification')
})

export { pushNotification as default }
