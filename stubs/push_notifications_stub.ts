import { PushNotification } from '../src/push_notification.js'
import FCMSendException from '../src/exceptions/fcm_exception.js'

export class PushNotificationStub extends PushNotification {
  async sendRaw(message: any): Promise<any> {
    const res = await fetch(this.config.stubUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new FCMSendException(res.status, res.statusText)
    }

    return json
  }
}
