/**
 * Error codes returned by the FCM HTTP v1 API in the `error.details[].errorCode` field.
 * See https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode
 */
export type FcmErrorCode =
  | 'UNSPECIFIED_ERROR'
  | 'INVALID_ARGUMENT'
  | 'UNREGISTERED'
  | 'SENDER_ID_MISMATCH'
  | 'QUOTA_EXCEEDED'
  | 'UNAVAILABLE'
  | 'INTERNAL'
  | 'THIRD_PARTY_AUTH_ERROR'

export interface PushNotificationConfig {
  clientEmail: string
  privateKey: string
  projectId: string

  stubUrl?: string
}

export type FcmNotification = {
  title?: string
  body?: string
  image?: string
}

export type FcmData = Record<string, string>

export type FcmMessageOptions = {
  token?: string
  notification?: FcmNotification
  data?: FcmData
  android?: any
  apns?: any
  webpush?: any
  topic?: string
}

export type GoogleAccessTokenResponse = {
  access_token: string
  expires_in: number
  token_type: string
}
