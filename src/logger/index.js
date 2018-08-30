const config = require('./config')

class Logger {
  constructor() {
    if (config.env === 'production' && config.logServer && config.logServerPort && config.logName) {
      this.fluent = require('fluent-logger')
      this.fluent.configure(config.logName, {
        host: config.logServer,
        port: config.logServerPort,
        timeout: 3.0,
        reconnectInterval: 100000, // 100 seconds
      })
    }
  }
  sendLog(message, type) {
    if (this.fluent) {
      let sendMess
      if (!(message instanceof Object)) {
        sendMess = { logType: type, message }
      } else {
        sendMess = { ...message, logType: type }
      }
      this.fluent.emit(sendMess)
    }
  }
  log(data) {
    this.sendLog(data, 'log')
  }
  warn(data) {
    this.sendLog(data, 'warn')
  }
  info(data) {
    this.sendLog(data, 'info')
  }
  error(data) {
    this.sendLog(data, 'error')
  }
  debug(data) {
    this.sendLog(data, 'debug')
  }
}

const instance = new Logger()
module.exports = instance
