const config = require('./config');

const winston = require('winston');
const { WebClient } = require('@slack/client');
const { Loggly } = require('winston-loggly-bulk');

if (process.env.LOGGY_TOKEN) {
  winston.add(new Loggly({
    token: process.env.LOGGY_TOKEN,
    subdomain: 'muaiphone',
    tags: [config.logName],
    json: true,
  }));
}

class Logger {
  constructor() {
    if (config.env === 'production' && config.logServer && config.logServerPort && config.logName) {
      this.fluent = require('fluent-logger');
      this.fluent.configure(config.logName, {
        host: config.logServer,
        port: config.logServerPort,
        timeout: 3.0,
        reconnectInterval: 100000, // 100 seconds
      });
    }
    if (process.env.slackToken) {
      this.slackClient = new WebClient(process.env.slackToken);
    }
  }
  async sendSlack(message, type) {
    if (this.slackClient) {
      let text;
      if (typeof message === 'object') {
        const temp = Object.assign({ type, logName: config.logName }, message);
        text = JSON.stringify(temp, null, 2);
      } else {
        text = message;
      }
      text = `\`\`\`${text}\`\`\``;
      await this.slackClient.chat.postMessage({
        channel: process.env.slackChannelId,
        text,
      });
    }
  }
  async sendLog(message, type) {
    const logData = JSON.stringify(message);
    console.log(logData);
    if (process.env.LOGGY_TOKEN && logData.length < 10 * 1024) {
      const loggy = Object.assign({ logName: config.logName }, message);
      winston.log(type, loggy);
    }
    if (type === 'critical') {
      await this.sendSlack(message, type);
    }
    if (this.fluent) {
      let sendMess;
      try {
        if (!(message instanceof Object)) {
          sendMess = { logType: type, message };
        } else {
          const parseMessage = JSON.parse(JSON.stringify(message));
          sendMess = { ...parseMessage, logType: type };
        }
        this.fluent.emit(sendMess);
      } catch (error) {
        if (message && message.message) {
          sendMess = { message: message.message, logType: type };
          this.fluent.emit(sendMess);
        } else {
          sendMess = { message: 'Cannot send log', logType: type };
          this.fluent.emit(sendMess);
        }
      }
    }
  }
  log(data) {
    this.sendLog(data, 'log');
  }
  warn(data) {
    this.sendLog(data, 'warn');
  }
  info(data) {
    this.sendLog(data, 'info');
  }
  error(data, isCritical = false) {
    if (isCritical) this.sendLog(data, 'critical');
    else this.sendLog(data, 'error');
  }
  debug(data) {
    this.sendLog(data, 'debug');
  }
}

const instance = new Logger();
module.exports = instance;
