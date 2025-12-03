import Fastify from 'fastify'

type Notification = {
  id: number
  timestamp: string
  data: any
  headers: any
  query: any
}

export class Catcher {
  #notifications: Notification[] = []

  #fastify: ReturnType<typeof Fastify>

  constructor(private readonly port: number) {}

  getNotifications(offset: number, limit: number) {
    return {
      total: this.#notifications.length,
      limit,
      offset,
      notifications: this.#notifications.slice(offset, offset + limit),
    }
  }

  async start() {
    this.#fastify = Fastify({
      logger: false,
    })

    this.#fastify.post('/push', async (request: any) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        data: request.body,
        headers: request.headers,
        query: request.query,
      } as Notification

      this.#notifications.unshift(notification)

      if (this.#notifications.length > 1000) {
        this.#notifications.pop()
      }

      this.#fastify.log.info(`Nouvelle notification reçue: ${notification.id}`)

      return {
        success: true,
        message: 'Notification capturée',
        id: notification.id,
      }
    })

    this.#fastify.get('/messages', async (request: any) => {
      const limit = Number.parseInt(request.query.limit) || 100
      const offset = Number.parseInt(request.query.offset) || 0

      return {
        total: this.#notifications.length,
        limit,
        offset,
        notifications: this.#notifications.slice(offset, offset + limit),
      }
    })

    this.#fastify.delete('/messages', async () => {
      const count = this.#notifications.length
      this.#notifications = []

      return {
        success: true,
        message: `${count} notification(s) effacée(s)`,
      }
    })

    await this.#fastify.listen({ port: this.port, host: '0.0.0.0' })
    console.log(`🚀 Serveur démarré sur http://localhost:${this.port}`)
  }

  stop() {
    this.#fastify.close()
    this.#notifications = []
  }
}
