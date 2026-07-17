import Fastify from 'fastify'
import { test } from '@japa/runner'

import { PushNotificationStub } from '../stubs/push_notifications_stub.js'
import FCMSendException from '../src/exceptions/fcm_exception.js'

async function startErrorServer(port: number, status: number, body: unknown) {
  const fastify = Fastify({ logger: false })

  fastify.post('/push', async (_request, reply) => {
    reply.status(status).send(body)
  })

  await fastify.listen({ port, host: '0.0.0.0' })

  return fastify
}

test.group('FCMSendException', () => {
  test('Should expose the FCM errorCode when the token is unregistered', async ({ assert }) => {
    const server = await startErrorServer(6557, 404, {
      error: {
        code: 404,
        message: 'Requested entity was not found.',
        status: 'NOT_FOUND',
        details: [
          {
            '@type': 'type.googleapis.com/google.firebase.fcm.v1.FcmError',
            'errorCode': 'UNREGISTERED',
          },
        ],
      },
    })

    const notification = new PushNotificationStub({
      clientEmail: 'test@test.com',
      privateKey: 'privateKey',
      projectId: 'test-project',

      stubUrl: 'http://localhost:6557/push',
    })

    try {
      await notification.sendToToken('DEAD_TOKEN', { title: 'Title', body: 'Body' }, {})
      assert.fail('sendToToken should have thrown')
    } catch (error) {
      assert.instanceOf(error, FCMSendException)
      assert.equal((error as FCMSendException).httpStatus, 404)
      assert.equal((error as FCMSendException).fcmErrorCode, 'UNREGISTERED')
    } finally {
      await server.close()
    }
  })

  test('Should leave fcmErrorCode undefined when the FCM response has no error details', async ({
    assert,
  }) => {
    const server = await startErrorServer(6558, 500, {
      error: { code: 500, message: 'Internal error', status: 'INTERNAL' },
    })

    const notification = new PushNotificationStub({
      clientEmail: 'test@test.com',
      privateKey: 'privateKey',
      projectId: 'test-project',

      stubUrl: 'http://localhost:6558/push',
    })

    try {
      await notification.sendToToken('SOME_TOKEN', { title: 'Title', body: 'Body' }, {})
      assert.fail('sendToToken should have thrown')
    } catch (error) {
      assert.instanceOf(error, FCMSendException)
      assert.equal((error as FCMSendException).httpStatus, 500)
      assert.isUndefined((error as FCMSendException).fcmErrorCode)
    } finally {
      await server.close()
    }
  })
})
