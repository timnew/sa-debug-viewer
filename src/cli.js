import yargs from 'yargs'

import DebugEventStream from './DebugEventStream'

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

const [host] = args._

const stream = new DebugEventStream(host)
let observable = stream.toObservable()

if (args.project != null) {
  observable = observable.filter((entry) => entry.project === args.project)
}

if (args.event != null) {
  observable = observable.filter((entry) => entry.message.type === 'track' && args.event.includes(entry.message.event))
}

if (args.event != null) {
  observable = observable.filter((entry) => args.userId.includes(entry.message.distinct_id))
}

/* eslint-disable no-console */
observable.subscribe(
  (data) => console.info('Next: ', data),
  (err) => console.error('Error: ', err),
  () => console.info('Completed'),
)
