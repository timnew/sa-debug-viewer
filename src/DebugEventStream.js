import { Readable } from 'stream'

import { createSession, fetchData, buildUrls } from './queries'
import createObservable from './rx'

class DebugEventStream extends Readable {
  constructor(host, options = {}) {
    super(Object.assign({ }, options, { objectMode: true }))

    if (host == null) throw new Error('Host is not provided')
    this._urls = buildUrls(host)

    this._sessionId = options.sessionId
  }

  get urls() { return this._urls }
  get sessionId() { return this._sessionId }
  get sessionBound() { return this._sessionId != null }

  async _read() {
    try {
      if (!this.sessionBound) {
        await this.createSession()
      }
      await this.fetchData()
    } catch (ex) {
      this.emit('error', ex)
    }
  }

  async createSession() {
    this._sessionId = await createSession(this.urls.registerSession, this.sessionId)
  }

  async fetchData() {
    const entries = await fetchData(this.urls.fetchData, this.sessionId)
    entries.forEach((entry) => this.push(entry))
  }

  toObservable() {
    return createObservable(this)
  }
}

export default DebugEventStream
