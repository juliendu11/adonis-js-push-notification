import { Exception } from '@adonisjs/core/exceptions'

export default class FCMSendException extends Exception {
  static status = 500
  static code = 'E_FCM_SEND_ERROR'
  static message = 'FCM Error'
  static name = 'E_FCM_SEND_ERROR'

  constructor(statusCode: number, statusText: string) {
    super()

    this.message = `FCM Error (${statusCode} ${statusText})`
  }
}
