# AdonisJS Push Notification

Add support for sending push notifications via the Firebase Cloud Messaging API.

## Installation

Install the package from npm using the following command:

```bash
npm i @juliendu11/adonis-js-push-notification
```

then run configuration command:

```bash
node ace configure @juliendu11/adonis-js-push-notification
```

## Configuration

The configuration file is located at `config/push_notification.ts`. You can set your Firebase server key and other
options there.

| Name         | Description                                                                                                                                                                                                                        | Required |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| clientEmail* | For the iss and sub fields, in order to obtain an authentication token from oauth2.googleapis.com                                                                                                                                  | Required |
| privateKey*  | Your private signing key to sign the token                                                                                                                                                                                         | Required |
| projectId*   | The project ID corresponding to your Firebase/Google project                                                                                                                                                                       | Required |
| stubUrl      | If you want to stub Firebase with another external service, which is useful during the development phase to view notifications, I've created a dashboard for that [here](https://github.com/juliendu11/push-notification-catcher). | Optional |

\* can find this information in the service account file, which you can find in the Google console or Firebase.

## How to use

You can use the PushNotification service in your controllers or services by directly using the service, like this:

```typescript
import pushNotification from '@juliendu11/adonis-js-push-notification/services/main'

@inject()
export default class NotificationService {

  async send() {
    await pushNotification.sendToToken(<TOKEN>, <FcmNotification>, <FcmData>)
  }
}
```

or by injecting it via the AdonisJS container:

```typescript
const pushNotification = await this.app.container.make('pushNotification')
await pushNotification.sendToToken(<TOKEN>, <FcmNotification>, <FcmData>)
```

or

```typescript

@inject()
export default class NotificationController {
  constructor(protected pushNotification: PushNotification) {
  }
}
```

### Methods

The PushNotification service provides the following methods:

| Name        | Description                                      |
|-------------|--------------------------------------------------|
| sendToToken | Sends a message to an FCM push token             |
| sendToTopic | Send a message to a topic (Topic name)           |
| sendRaw     | Basic method used by sendToToken and sendToTopic |

## Info

- [FCM Google API Doc](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send)
