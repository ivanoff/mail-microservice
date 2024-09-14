![mail-microservice](./logo.webp)

# Mail Microservice

- [Mail Microservice](#mail-microservice)
  - [Introduction](#introduction)
  - [Usage example](#usage-example)
  - [Setup](#setup)
    - [Server Setup](#server-setup)
    - [Client Setup](#client-setup)
  - [Usage](#usage)
    - [Connecting to the Service](#connecting-to-the-service)
    - [Managing SMTP Configurations](#managing-smtp-configurations)
    - [Managing Email Templates](#managing-email-templates)
    - [Sending Emails](#sending-emails)
    - [Closing the Connection](#closing-the-connection)
  - [License](#license)
  - [Contributing](#contributing)
  - [Support](#support)
  - [Created by](#created-by)

## Introduction

This document provides instructions for setting up and using the **mail microservice**, which allows you to manage SMTP configurations, email templates, and send emails using various SMTP servers and templates.

## Usage example

Before running this example, make sure to [set up the mail-microservice server](#server-setup).

```javascript
import EmailServiceClient from 'mail-microservice';

async function main() {
  const client = new EmailServiceClient('amqp://user:rabbitmq_password@localhost', {
    request: 'email_requests',
    response: 'email_responses',
  });

  await client.connect();

  // Add SMTP-configuration
  await client.addSMTPConfig('default', {
    from: 'noreply@example.com',
    host: 'HOST',
    port: 587,
    user: 'LOGIN',
    password: 'PASSWORD',
    secure: false,
    tls: false,
  });

  // Add template
  await client.addTemplate('welcome', {
    subject: 'Welcome, {{name}}!',
    text: 'Welcome, {{name}}!\nThis is a test message.',
    html: '<b>Welcome, {{name}}!</b><br />This is a test message.',
  });

  // Send e-mail without callback
  await client.sendEmail({
    email: '2@ivanoff.org.ua',
    templateName: 'welcome',
    data: { name: 'John Doe' },
  });
```

## Setup

### Server Setup

To set up the mail microservice server:

1. Clone the repository:
   ```
   git clone https://github.com/ivanoff/mail-microservice.git
   ```

2. Navigate to the project directory:
   ```
   cd mail-microservice
   ```

3. Build and run the Docker containers:
   ```
   sudo docker compose build && sudo docker compose up
   ```

This will start Redis, RabbitMQ, and the mail-microservice server.

The server will attempt to connect to RabbitMQ. You may see messages like:
```
email-service-1  | Failed to connect to RabbitMQ. Retrying in 5 seconds... Failed to connect
email-service-1  | Connected
```

### Client Setup

This microservice provides a flexible way to manage email configurations, templates, and sending. It integrates with RabbitMQ for message queuing and uses Mustache for templating. Remember to handle errors appropriately and close the connection when finished.

To use the mail-microservice in your project:

1. Install the npm module:
   ```
   npm install mail-microservice
   ```

2. Import the module in your code:
   ```javascript
   import EmailServiceClient from 'mail-microservice';
   ```

## Usage

### Connecting to the Service

```javascript
const client = new EmailServiceClient('amqp://user:rabbitmq_password@localhost', {
  request: 'email_requests',
  response: 'email_responses',
});

await client.connect();
```

### Managing SMTP Configurations

Add an SMTP configuration:

```javascript
await client.addSMTPConfig('default', {
  from: 'noreply@example.com',
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  user: 'AKIA...P2',
  password: 'BFk...AjIyp',
  secure: false,
  tls: false,
});
```

You can also update or delete SMTP configurations using similar methods.

### Managing Email Templates

Add an email template:

```javascript
await client.addTemplate('welcome', {
  subject: 'Welcome, {{name}}!',
  text: 'Welcome, {{name}}!\nThis is a test message.',
  html: '<b>Welcome, {{name}}!</b><br />This is a test message.',
});
```

The service uses Mustache as the templating engine. You can also update or delete templates using similar methods.

### Sending Emails

There are three ways to send emails:

1. Send without a callback:

```javascript
await client.sendEmail({
  email: 'recipient@example.com',
  templateName: 'welcome',
  data: { name: 'John Doe' },
});
```

2. Send with a callback:

```javascript
await client.sendEmail({
  email: 'recipient@example.com',
  templateName: 'welcome',
  data: { name: 'John Doe' },
  callback: (error, result) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', result);
    }
  }
});
```

3. Send and wait for the result:

```javascript
try {
  const result = await client.sendEmailAndWaitForResult({
    email: 'recipient@example.com',
    templateName: 'welcome',
    data: { name: 'John Doe' },
  });
  console.log('Email sent successfully:', result);
} catch(error) {
  console.error('Error sending email:', error);
}
```

### Closing the Connection

When you're done using the client, close the connection:

```javascript
await client.close();
```

## License

This project is distributed under the `MIT` license. See the [LICENSE](./LICENSE) file for more information.

Please note that `ClamAV` is licensed under the Apache 2.0 license. More details can be found [here](https://github.com/bcgov/clamav/blob/master/LICENSE)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Support

If you encounter any problems or have questions, please open an issue in the project repository.

## Created by

Dimitry Ivanov <2@ivanoff.org.ua> # curl -A cv ivanoff.org.ua

