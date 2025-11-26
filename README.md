[![NPM](https://nodei.co/npm/@juliendu11/adonis-js-push-notification.png)](https://npmjs.org/package/@juliendu11/adonis-js-push-notification)

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
