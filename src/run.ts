/**
 * Run a function
 * @param fn Function to run
 * @returns Return value of the function
 */
const run = <T>(fn: (...args: unknown[]) => T) => fn()

export default run
