import { Observable } from 'rx'

export function hookStream(stream) {
  stream.pause()

  return (observer) => {
    const onData = ::observer.onNext
    const onError = ::observer.onError
    const onEnd = ::observer.onCompleted

    stream.addListener('data', onData)
    stream.addListener('error', onError)
    stream.addListener('end', onEnd)

    stream.resume()

    return () => {
      stream.removeListener('data', onData)
      stream.removeListener('error', onError)
      stream.removeListener('end', onEnd)
    }
  }
}

export default function createObservable(stream) {
  return Observable.create(hookStream(stream))
                   .publish()
                   .refCount()
}
