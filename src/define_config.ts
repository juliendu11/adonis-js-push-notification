import type { PushNotificationConfig } from './types.js'

export function defineConfig<T extends PushNotificationConfig>(config: T): T {
  return config
}
