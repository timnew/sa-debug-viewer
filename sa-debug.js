#! /usr/bin/env node --harmony -r babel-register

import Promise from 'bluebird'
import fetch from 'node-fetch'
import { Subject } from 'rx'

import yargs from 'yargs'

const args = yargs.usage('sa-debug [options] <host>')
                  .option('project', {
                    alias: 'p',
                    describe: 'Project to monitor',
                    type: 'string',
                  })
                  .option('event', {
                    alias: 'e',
                    describe: 'Event filter',
                    type: 'array',
                  })
                  .option('userId', {
                    alias: 'u',
                    describe: 'User id',
                    type: 'array',
                  })
                  .demand(1, 'Host must be provided')
                  .help('help')
                  .argv

const ENTRY_REGEXP = /^\[(\w+)\] dry_run: (true|false), valid message:(.*)/

class DataStream extends Subject {
  constructor(host) {
    super()
    console.log(`Connect to ${host}...`)
    this.registerUrl = `${host}/accessories/debug_data_session_register`
    this.fetchUrl = `${host}/accessories/debug_data_fetch`
  }

  async register(sessionId = `${Date.now()}`) {
    this.sessionId = sessionId

    const response = await fetch(
      this.registerUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: this.sessionId }),
      }
    )

    if (!response.ok) {
      console.error('Server')
      throw new Error(`Server error: ${response.status}`)
    }

    const body = await response.json()

    if (!body.ok) {
      throw new Error(`Response Error: ${body}`)
    }

    return this
  }

  async fetchData() {
    const response = await fetch(
      this.fetchUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: this.sessionId }),
      }
    )

    if (!response.ok) {
      this.onError(`Error: ${response.status}`)
      return setImmediate(::this.fetchData)
    }

    const serverData = await response.json()

    if (!serverData.ok) {
      this.onError(serverData)
      return setImmediate(::this.fetchData)
    }

    serverData.data.forEach((entry) => this.onNext(this.parseEntry(entry)))

    return setImmediate(::this.fetchData)
  }

  parseEntry(entry) {
    const matches = ENTRY_REGEXP.exec(entry)
    return {
      project: matches[1],
      dryRun: JSON.parse(matches[2]),
      message: JSON.parse(matches[3]),
    }
  }

  async start() {
    if (this.sessionId == null) {
      throw new Error('Session is null')
    }

    this.fetchData()

    return this
  }
}

const [host] = args._

Promise.resolve(new DataStream(host))
       .then((stream) => stream.register())
       .then((stream) => stream.start())
       .then((stream) => (args.project == null ? stream : stream.filter((entry) => entry.project === args.project)))
       .then((stream) => (args.event == null ? stream : stream.filter((entry) => entry.message.type === 'track' && args.event.includes(entry.message.event))))
       .then((stream) => (args.event == null ? stream : stream.filter((entry) => args.userId.includes(entry.message.distinct_id))))
       .then((stream) => stream.subscribe(
         (data) => console.log('Next: ', data),
         (err) => console.log('Error: ', err),
         () => console.log('Completed'),
       ))
