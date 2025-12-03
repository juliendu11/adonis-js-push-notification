import { test } from '@japa/runner'
import { Catcher } from '../test_helpers/catcher.js'
import { PushNotificationStub } from '../stubs/push_notifications_stub.js'

test.group('PushNotification', () => {
  test('Should format notification correctly when use sendToTopic()', async ({ assert }) => {
    const catcherInstance = new Catcher(6556)

    await catcherInstance.start()

    const notification = new PushNotificationStub({
      clientEmail: 'test@test.com',
      privateKey: 'privateKey',
      projectId: 'test-project',

      stubUrl: 'http://localhost:6556/push',
    })

    await notification.sendToTopic(
      'news',
      {
        title: 'Breaking News',
        body: 'This is the body of the breaking news.',
      },
      {
        articleId: '12345',
      }
    )

    const messagesResponse = await catcherInstance.getNotifications(0, 10)

    assert.equal(messagesResponse.total, 1)
    assert.equal(messagesResponse.notifications[0].data.message.topic, 'news')
    assert.equal(messagesResponse.notifications[0].data.message.notification.title, 'Breaking News')
    assert.equal(
      messagesResponse.notifications[0].data.message.notification.body,
      'This is the body of the breaking news.'
    )
    assert.equal(messagesResponse.notifications[0].data.message.data.articleId, '12345')

    catcherInstance.stop()
  })

  test('Should format notification correctly when use sendToToken()', async ({ assert }) => {
    const catcherInstance = new Catcher(6556)

    await catcherInstance.start()

    const notification = new PushNotificationStub({
      clientEmail: 'test@test.com',
      privateKey: 'privateKey',
      projectId: 'test-project',

      stubUrl: 'http://localhost:6556/push',
    })

    await notification.sendToToken(
      'TOKEN_ABC123',
      {
        title: 'Breaking News',
        body: 'This is the body of the breaking news.',
      },
      {
        articleId: '12345',
      }
    )

    const messagesResponse = await catcherInstance.getNotifications(0, 10)

    assert.equal(messagesResponse.total, 1)
    assert.equal(messagesResponse.notifications[0].data.message.token, 'TOKEN_ABC123')
    assert.equal(messagesResponse.notifications[0].data.message.notification.title, 'Breaking News')
    assert.equal(
      messagesResponse.notifications[0].data.message.notification.body,
      'This is the body of the breaking news.'
    )
    assert.equal(messagesResponse.notifications[0].data.message.data.articleId, '12345')

    catcherInstance.stop()
  })

  test('Should format notification correctly when use sendRaw()', async ({ assert }) => {
    const catcherInstance = new Catcher(6556)

    await catcherInstance.start()

    const notification = new PushNotificationStub({
      clientEmail: 'test@test.com',
      privateKey: 'privateKey',
      projectId: 'test-project',

      stubUrl: 'http://localhost:6556/push',
    })

    await notification.sendRaw({
      token: 'TOKEN_ABC123',
      notification: {
        title: 'Breaking News',
        body: 'This is the body of the breaking news.',
      },
      data: {
        articleId: '12345',
      },
    })

    const messagesResponse = await catcherInstance.getNotifications(0, 10)

    assert.equal(messagesResponse.total, 1)
    assert.equal(messagesResponse.notifications[0].data.message.token, 'TOKEN_ABC123')
    assert.equal(messagesResponse.notifications[0].data.message.notification.title, 'Breaking News')
    assert.equal(
      messagesResponse.notifications[0].data.message.notification.body,
      'This is the body of the breaking news.'
    )
    assert.equal(messagesResponse.notifications[0].data.message.data.articleId, '12345')

    catcherInstance.stop()
  })
})
