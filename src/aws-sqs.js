const aws = require('aws-sdk');

const queueUrl = process.env.sqsQueueUrl;

class SqsService {
  constructor() {
    if (process.env.awsAccessKeyId && process.env.awsSecretAccessKey && process.env.sqsQueueUrl) {
      aws.config.update({
        region: 'ap-southeast-1',
        accessKeyId: process.env.awsAccessKeyId,
        secretAccessKey: process.env.awsSecretAccessKey,
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
}

module.exports = new SqsService();
