import Promise from 'bluebird'
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

Promise.resolve(new DebugEventStream(host))
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
