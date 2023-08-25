import { readFileSync } from 'fs'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays/from-string'

const ceramic = new CeramicClient('https://ceramic-temp.hirenodes.io')

/**
 * @param {Ora} spinner - to provide progress status.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
export const writeComposite = async (spinner) => {
  await authenticate()
  spinner.succeed('admin authenticated successfully')
}

/**
 * Authenticating DID for publishing composite
 * @return {Promise<void>} - return void when DID is authenticated.
 */
const authenticate = async () => {
  const seed = process.env.SEED
  const key = fromString(seed, 'base16')
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  })
  await did.authenticate()
  ceramic.did = did
}
