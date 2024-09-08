export const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  rabbitMQ: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queues: {
      request: 'email_requests',
      response: 'email_responses'
    }
  }
};
