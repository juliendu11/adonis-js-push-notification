import { PushNotificationConfig } from './types/main.js'

export function defineConfig<T extends PushNotificationConfig>(config: T): T {
  return config
}
