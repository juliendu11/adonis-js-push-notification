import { Exception } from '@adonisjs/core/exceptions'

export default class OAuthException extends Exception {
  static status = 500
  static code = 'E_FCM_OAUTH_ERROR'
  static message = 'OAuth FCM Error'
  static name = 'E_FCM_OAUTH_ERROR'

  constructor(statusCode: number, statusText: string, responseText: string) {
    super()

    this.message = `OAuth FCM Error (${statusCode} ${statusText}): ${responseText}`
  }
}
