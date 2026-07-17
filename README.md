# AdonisJS Push Notification

Add support for sending push notifications via the Firebase Cloud Messaging API.

## Installation

Install the package from npm using the following command:

```bash
// FOR ADONISJS 6
npm i @juliendu11/adonis-js-push-notification

// FOR ADONISJS 7
npm i @juliendu11/adonis-js-push-notification@next
```

then run configuration command:

```bash
node ace configure @juliendu11/adonis-js-push-notification
```

## Configuration

The configuration file is located at `config/push_notification.ts`. You can set your Firebase server key and other
options there.

| Name          | Description                                                                                                                                                                                                                        | Required |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| clientEmail\* | For the iss and sub fields, in order to obtain an authentication token from oauth2.googleapis.com                                                                                                                                  | Required |
| privateKey\*  | Your private signing key to sign the token                                                                                                                                                                                         | Required |
| projectId\*   | The project ID corresponding to your Firebase/Google project                                                                                                                                                                       | Required |
| stubUrl       | If you want to stub Firebase with another external service, which is useful during the development phase to view notifications, I've created a dashboard for that [here](https://github.com/juliendu11/push-notification-catcher). | Optional |

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
  constructor(protected pushNotification: PushNotification) {}
}
```

### Methods

The PushNotification service provides the following methods:

| Name        | Description                                      |
| ----------- | ------------------------------------------------ |
| sendToToken | Sends a message to an FCM push token             |
| sendToTopic | Send a message to a topic (Topic name)           |
| sendRaw     | Basic method used by sendToToken and sendToTopic |

## Error handling

When a send fails (`sendToToken`, `sendToTopic`, `sendRaw`), the promise rejects with a `FCMSendException`
(exported from the package entrypoint):

```typescript
import { FCMSendException } from '@juliendu11/adonis-js-push-notification'
import pushNotification from '@juliendu11/adonis-js-push-notification/services/main'

try {
  await pushNotification.sendToToken(<TOKEN>, <FcmNotification>, <FcmData>)
} catch (error) {
  if (error instanceof FCMSendException) {
    console.log(error.httpStatus) // HTTP status code returned by FCM, e.g. 404
    console.log(error.fcmErrorCode) // FCM error code, e.g. 'UNREGISTERED'
    console.log(error.responseBody) // Raw parsed JSON error body returned by FCM
  }
}
```

`fcmErrorCode` is parsed from the FCM v1 API response (`error.details[].errorCode`) and can be `undefined` if FCM
didn't return a structured error body. Possible values, per the
[FCM error reference](https://firebase.google.com/docs/reference/fcm/rest/v1/ErrorCode):

| Code                     | Meaning                                                                                   | What to do                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `UNREGISTERED`           | The token is no longer valid (app uninstalled, token rotated, etc.)                       | Stop using this token and remove/flag it in your database — it will never work again.                    |
| `INVALID_ARGUMENT`       | The request is malformed (bad token format, invalid message fields, etc.)                 | Check the token format and message payload; can also happen on a code bug, not always the token's fault. |
| `SENDER_ID_MISMATCH`     | The token was registered to a different Firebase project/sender than the one you're using | Check your `projectId`/credentials configuration before assuming the token is dead.                      |
| `QUOTA_EXCEEDED`         | You're sending too many messages too fast                                                 | Back off and retry later; do not treat the token as dead.                                                |
| `UNAVAILABLE`            | FCM is temporarily unavailable                                                            | Retry later with backoff; do not treat the token as dead.                                                |
| `INTERNAL`               | Internal error on FCM's side                                                              | Retry later; do not treat the token as dead.                                                             |
| `THIRD_PARTY_AUTH_ERROR` | APNs certificate/auth issue (iOS only)                                                    | Check your APNs configuration.                                                                           |
| `UNSPECIFIED_ERROR`      | Unknown error                                                                             | Log and investigate.                                                                                     |

Only `UNREGISTERED` reliably means the token itself is permanently dead — the other codes are either transient or
configuration issues and should not be used to decide whether to delete a token.

## Info

- [FCM Google API Doc](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send)
