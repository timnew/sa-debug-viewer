import debug from './debug'

export class ResponseStatusError extends Error {
  constructor(message, statusCode) {
    super(message)
    Error.captureStackTrace(this, ResponseStatusError)
    this.statusCode = statusCode

    debug('Server Status Error [%s]: %s', statusCode, message)
  }
}

export class ResponseContentError extends Error {
  constructor(message, body) {
    super(message)
    Error.captureStackTrace(this, ResponseContentError)
    this.body = body

    debug('Response Content Error: %s -> %j', message, body)
  }
}
