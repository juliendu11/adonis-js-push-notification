import { Exception } from '@adonisjs/core/exceptions'

import { type FcmErrorCode } from '../types.js'

function extractFcmErrorCode(responseBody: unknown): FcmErrorCode | undefined {
  const details = (responseBody as any)?.error?.details

  if (!Array.isArray(details)) {
    return undefined
  }

  return details.find((detail: any) => typeof detail?.errorCode === 'string')?.errorCode
}

export default class FCMSendException extends Exception {
  static status = 500
  static code = 'E_FCM_SEND_ERROR'
  static message = 'FCM Error'
  static name = 'E_FCM_SEND_ERROR'

  readonly httpStatus: number
  readonly httpStatusText: string
  readonly fcmErrorCode?: FcmErrorCode
  readonly responseBody?: unknown

  constructor(statusCode: number, statusText: string, responseBody?: unknown) {
    super()

    this.httpStatus = statusCode
    this.httpStatusText = statusText
    this.responseBody = responseBody
    this.fcmErrorCode = extractFcmErrorCode(responseBody)

    this.message = this.fcmErrorCode
      ? `FCM Error (${statusCode} ${statusText}): ${this.fcmErrorCode}`
      : `FCM Error (${statusCode} ${statusText})`
  }
}
