const aws = require('aws-sdk');

const queueUrl = process.env.sqsQueueUrl;

class SqsService {
  constructor() {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_KEY && process.env.sqsQueueUrl) {
      aws.config.update({
        region: 'ap-southeast-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      });
      const sqs = new aws.SQS({ apiVersion: '2012-11-05' });
      this.sqs = sqs;
    }
  }

  sendMessage(message, delaySeconds = 0) {
    if (this.sqs) {
      return new Promise((resolve, reject) => {
        try {
          const params = {
            DelaySeconds: delaySeconds,
            MessageBody: JSON.stringify(message),
            QueueUrl: queueUrl,
          };
          this.sqs.sendMessage(params, (err, data) => {
            if (err) {
              console.log('Error', err);
              reject(err);
            } else {
              console.log('Success', data.MessageId);
              resolve(data);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  sendMessageQueueName(message, delaySeconds = 0, queueName = queueUrl) {
    if (this.sqs) {
      return new Promise((resolve, reject) => {
        try {
          const params = {
            DelaySeconds: delaySeconds,
            MessageBody: JSON.stringify(message),
            QueueUrl: queueName,
          };
          this.sqs.sendMessage(params, (err, data) => {
            if (err) {
              console.log('Error', err);
              reject(err);
            } else {
              console.log('Success', data.MessageId);
              resolve(data);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    return null;
  }
}

module.exports = new SqsService();
