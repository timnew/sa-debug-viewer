import fetch from 'node-fetch'
import urlUtil from 'url'

import debug from './debug'
import { ResponseStatusError, ResponseContentError } from './errors'

const ENTRY_REGEXP = /^\[(\w+)\] dry_run: (true|false), valid message:(.*)/

export async function createSession(registerUrl, sessionId = String(Date.now())) {
  debug('Create session %s at %s ...', sessionId, registerUrl)

  const response = await fetch(
    registerUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    }
  )

  if (!response.ok) {
    throw new ResponseStatusError('Server error', response.status)
  }

  const body = await response.json()
  if (!body.ok) {
    throw new ResponseContentError('Invalid body', body)
  }

  debug('Session Created: ${sessionId}')
  return sessionId
}

export function parseEntry(entry) {
  const matches = ENTRY_REGEXP.exec(entry)
  return {
    project: matches[1],
    dryRun: JSON.parse(matches[2]),
    message: JSON.parse(matches[3]),
  }
}

export async function fetchData(fetchUrl, sessionId) {
  debug('Fetching data...')

  const response = await fetch(
    fetchUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId }),
    }
  )

  if (!response.ok) {
    throw new ResponseStatusError('Server error', response.status)
  }

  const serverData = await response.json()

  if (!serverData.ok) {
    throw new ResponseContentError('Invalid body', serverData)
  }

  return serverData.data.map(parseEntry)
}

export function buildUrls(host) {
  return {
    registerSession: urlUtil.resolve(host, 'accessories/debug_data_session_register'),
    fetchData: urlUtil.resolve(host, 'accessories/debug_data_fetch'),
  }
}
