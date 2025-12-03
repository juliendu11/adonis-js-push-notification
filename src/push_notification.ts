import jwt from 'jsonwebtoken'
import {
  FcmData,
  FcmMessageOptions,
  FcmNotification,
  GoogleAccessTokenResponse,
  PushNotificationConfig,
} from './types/main.js'
import OAuthException from './exceptions/oauth_exception.js'
import FCMSendException from './exceptions/fcm_exception.js'

export class PushNotification {
  config: PushNotificationConfig

  #cachedToken: string | null = null
  #expiresAt: number = 0

  constructor(config: PushNotificationConfig) {
    this.config = config
  }

  private async getAccessToken() {
    const now = Date.now()

    if (this.#cachedToken && now < this.#expiresAt) {
      return this.#cachedToken
    }

    const iat = Math.floor(now / 1000)
    const exp = iat + 3600 // 1h

    const payload = {
      iss: this.config.clientEmail,
      sub: this.config.clientEmail,
      aud: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      iat,
      exp,
    }

    const jwtToken = jwt.sign(payload, this.config.privateKey, {
      algorithm: 'RS256',
    })

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new OAuthException(res.status, res.statusText, text)
    }

    const data = (await res.json()) as GoogleAccessTokenResponse

    this.#cachedToken = data.access_token
    this.#expiresAt = now + data.expires_in * 1000 - 30_000

    return this.#cachedToken
  }

  public async sendRaw(message: FcmMessageOptions) {
    const accessToken = await this.getAccessToken()

    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${this.config.projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      }
    )

    const json = await res.json()

    if (!res.ok) {
      throw new FCMSendException(res.status, res.statusText)
    }

    return json
  }

  public async sendToToken(token: string, notification?: FcmNotification, data?: FcmData) {
    const message = {
      token,
      notification,
      data,
    }

    return this.sendRaw(message)
  }

  public async sendToTopic(topic: string, notification?: FcmNotification, data?: FcmData) {
    const message = {
      topic,
      notification,
      data,
    }

    return this.sendRaw(message)
  }
}
