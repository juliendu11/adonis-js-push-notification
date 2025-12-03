import { PushNotification } from '../push_notification.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    pushNotification: PushNotification
  }
}
