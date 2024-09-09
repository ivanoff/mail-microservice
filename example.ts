import EmailServiceClient from './src/client';

async function main() {
  const client = new EmailServiceClient('amqp://user:rabbitmq_password@localhost', {
    request: 'email_requests',
    response: 'email_responses',
  });

  await client.connect();

  // Add SMTP-configuration
  await client.addSMTPConfig('default', {
    from: 'noreply@battlepro.com',
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

  // Send e-mail
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

  await client.close();
}

main().catch(console.error);
