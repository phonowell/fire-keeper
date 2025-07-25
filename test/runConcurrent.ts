import assert from 'assert'

import { runConcurrent } from '../src/index.js'

const test = async () => {
  const results: number[] = []
  const tasks = [
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 30))
      results.push(1)
      return 1
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      results.push(2)
      return 2
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 20))
      results.push(3)
      return 3
    },
  ]

  const output = await runConcurrent(2, tasks)

  assert.notDeepStrictEqual(results, [1, 2, 3])

  assert.deepStrictEqual(output, [1, 2, 3])
}

const testErrorHandling = async () => {
  const tasks = [
    () => Promise.resolve(1),
    () => Promise.reject(new Error('Error 1')),
    () => Promise.reject(new Error('Error 2')),
  ]

  try {
    await runConcurrent(2, tasks)
    throw new Error('Should throw AggregateError')
  } catch (error) {
    if (!(error instanceof AggregateError)) throw error
    assert.strictEqual(error.errors.length, 2)
    assert.strictEqual((error.errors[0] as Error).message, 'Error 1')
    assert.strictEqual((error.errors[1] as Error).message, 'Error 2')
  }
}

const testStopOnError = async () => {
  const executed: number[] = []
  const tasks = [
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 20))
      executed.push(1)
      return 1
    },
    () => {
      executed.push(2)
      return Promise.reject(new Error('Stop here'))
    },
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      executed.push(3)
      return 3
    },
  ]

  try {
    await runConcurrent(2, tasks, { stopOnError: true })
    throw new Error('Should throw error')
  } catch (error) {
    assert(error instanceof Error)
    assert.strictEqual(error.message, 'Stop here')
    assert(executed.length < 3)
  }
}

const testEdgeCases = async () => {
  const emptyResults = await runConcurrent(2, [])
  assert.deepStrictEqual(emptyResults, [])

  const tasks = [() => Promise.resolve(1), () => Promise.resolve(2)]
  const results = await runConcurrent(5, tasks)
  assert.deepStrictEqual(results, [1, 2])
}

export { test, testErrorHandling, testStopOnError, testEdgeCases }
