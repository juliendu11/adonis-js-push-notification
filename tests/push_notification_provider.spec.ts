import { test } from '@japa/runner'
import { setupApp } from '../test_helpers/app.js'

test.group('Provider', () => {
  test("Should register 'pushNotification' provider", async ({ assert }) => {
    const app = await setupApp()

    const pushNotification = await app.container.make('pushNotification')

    assert.exists(pushNotification)
    assert.equal(pushNotification.constructor.name, 'PushNotification')
  })
})
