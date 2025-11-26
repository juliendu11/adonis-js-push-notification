import { PushNotificationCore } from './main.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    pushNotification: PushNotificationCore
  }
}
