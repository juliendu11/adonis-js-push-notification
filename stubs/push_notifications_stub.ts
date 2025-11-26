import {
  FcmData,
  FcmNotification,
  PushNotificationConfig,
  PushNotificationCore,
} from '../src/types/main.js'

export class PushNotificationStub implements PushNotificationCore {
  #config: PushNotificationConfig

  constructor(config: PushNotificationConfig) {
    this.#config = config
  }

  async sendRaw(message: any): Promise<any> {
    const res = await fetch(this.#config.stubUrl as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })

    const json = await res.json()

    if (!res.ok) {
      throw new Error(`Erreur FCM (${res.status} ${res.statusText})`)
    }

    return json
  }

  async sendToToken(token: string, notification?: FcmNotification, data?: FcmData): Promise<any> {
    return this.sendRaw({
      token,
      notification,
      data,
    })
  }

  async sendToTopic(topic: string, notification?: FcmNotification, data?: FcmData): Promise<any> {
    return this.sendRaw({
      topic,
      notification,
      data,
    })
  }
}
