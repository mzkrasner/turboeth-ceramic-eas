import ora from 'ora'

import { spawn } from 'child_process'
import { EventEmitter } from 'events'
import { writeComposite } from './composites.mjs'

const events = new EventEmitter()
const spinner = ora()

const bootstrap = async () => {
  // TODO: convert to event driven to ensure functions run in correct orders after releasing the bytestream.
  // TODO: check if .grapql files match their .json counterparts
  //       & do not create the model if it already exists & has not been updated
  try {
    spinner.info('[Composites] bootstrapping composites')
    await writeComposite(spinner)
    spinner.succeed('Composites] composites bootstrapped')
  } catch (err) {
    spinner.fail(err.message)
    ceramic.kill()
    throw err
  }
}

const next = async () => {
  const next = spawn('npm', ['run', 'dev'])
  spinner.info('[NextJS] starting nextjs app')
  next.stdout.on('data', (buffer) => {
    console.log('[NextJS]', buffer.toString())
  })
}

const start = async () => {
  await bootstrap()
  await next()
}

start()

process.on('SIGTERM', () => {
  ceramic.kill()
})
process.on('beforeExit', () => {
  ceramic.kill()
})
