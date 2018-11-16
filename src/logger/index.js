const config = require('./config');

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
  }
  sendLog(message, type) {
    console.log(JSON.stringify(message));
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
  error(data) {
    this.sendLog(data, 'error');
  }
  debug(data) {
    this.sendLog(data, 'debug');
  }
}

const instance = new Logger();
module.exports = instance;
