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
