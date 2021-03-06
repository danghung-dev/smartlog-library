const kafka = require('kafka-node');
const { kafkaUrl, consumerGroup } = require('./messaging-config');
const logger = require('./logger');

module.exports = class SimpleConsumer {
  constructor(name, options) {
    this.name = (name || 'Default');
    this.handlerMap = new Map();
    this.consumer = null;
    this.topics = new Set();
    this.groupId = (options && options.groupId) || consumerGroup;
  }
  static getHandleKey(topic, eventType) {
    return `${topic}/${eventType}`;
  }
  handleMessage(message) {
    try {
      logger.debug(`new message ${message}`);
      const { topic } = message;
      const event = JSON.parse(message.value);
      const eventKey = SimpleConsumer.getHandleKey(topic, event.type);
      const handler = this.handlerMap.get(eventKey);
      if (handler) {
        handler({ event, handleKey: eventKey, topic });
      } else {
        logger.info(`Not interesting event ${eventKey}`);
      }
    } catch (error) {
      logger.error(`Unable to handle event ${message}`);
      logger.error(`Error ${error}`);
    }
  }
  handleError(err) {
    logger.error(`Consumer ${this.name}error ${err}`);
  }
  connect() {
    return new Promise((resolve, reject) => {
      try {
        logger.info(`Consumer ${this.name} listen to kafka at ${kafkaUrl}`);
        this.consumer = new kafka.ConsumerGroup({
          kafkaHost: kafkaUrl,
          groupId: this.groupId,
        }, [...this.topics]);

        this.consumer.on('message', this.handleMessage.bind(this));

        this.consumer.on('connect', () => {
          logger.info(`Consumer ${this.name} connects successfully`);
          resolve();
        });

        this.consumer.on('error', this.handleError.bind(this));
        // Set up the timeout
        setTimeout(() => {
          reject(new Error(`Timeout during initializing consumer ${this.name}`));
        }, 60000);
      } catch (err) {
        reject(err);
      }
    });
  }

  subscribe(topic, eventType, handler) {
    const handleKey = SimpleConsumer.getHandleKey(topic, eventType);
    if (this.handlerMap.get(handleKey)) {
      // support one handle/topic at this moment.
      throw new Error(`Duplicated handle on ${handleKey}`);
    }
    this.handlerMap.set(handleKey, handler);
    this.topics.add(topic);
  }
};
