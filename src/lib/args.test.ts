import assert from 'node:assert/strict'
import test from 'node:test'
import {parseArgs} from './args.js'

test('rejects unknown options', () => {
  assert.match(parseArgs(['--wat']).error ?? '', /unknown option/)
  assert.match(parseArgs(['one', 'two']).error ?? '', /single url/)
})
