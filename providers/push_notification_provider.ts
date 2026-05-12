import '../src/types.js'
import type { ApplicationService } from '@adonisjs/core/types'
import { PushNotification } from '../src/push_notification.js'
import type { PushNotificationConfig } from '../src/types.js'
import { PushNotificationStub } from '../stubs/push_notifications_stub.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    pushNotification: PushNotification
  }
}

export default class PushNotificationProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton('pushNotification', async () => {
      const config = this.app.config.get<PushNotificationConfig>('push_notification', {})

      if (config.stubUrl) {
        return new PushNotificationStub(config)
      }

      return new PushNotification(config)
    })
  }

  async boot() {}

  async shutdown() {}
}
