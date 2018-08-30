const config = require('./config')

class Logger {
  constructor() {
    if (config.env === 'production' && config.log_server && config.log_server_port && config.logName) {
      this.fluent = require('fluent-logger')
      this.fluent.configure(config.logName, {
        host: config.log_server,
        port: config.log_server_port,
        timeout: 3.0,
        reconnectInterval: 600000, // 10 minutes
      })
    }
  }
  sendLog(message, type) {
    if (this.fluent) {
      let sendMess
      if (!(message instanceof Object)) {
        sendMess = { message }
      } else {
        sendMess = message
      }
      this.fluent.emit(type, sendMess)
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
