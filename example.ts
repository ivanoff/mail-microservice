import EmailServiceClient from './src/client';

async function main() {
  const client = new EmailServiceClient('amqp://user:rabbitmq_password@localhost', {
    request: 'email_requests',
    response: 'email_responses',
  });

  await client.connect();

  // Add SMTP-configuration
  await client.addSMTPConfig('default', {
    from: 'noreply@example.com',
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    user: 'ERUX...WF',
    password: 'BdPp...eD',
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

  // Send e-mail with callback
  await client.sendEmail({
    email: '2@ivanoff.org.ua',
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

  // Send e-mail and wait for result
  try {
    const result = await client.sendEmailAndWaitForResult({
      email: '2@ivanoff.org.ua',
      templateName: 'welcome',
      data: { name: 'John Doe' },
    });
    console.log('Email sent successfully:', result);
  } catch(error) {
    console.error('Error sending email:', error);
  }

  await client.close();
}

main().catch(console.error);
