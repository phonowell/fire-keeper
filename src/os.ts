/**
 * Gets the current operating system identifier
 * @returns Operating system identifier: 'macos' for macOS/Darwin, 'windows' for Windows, or 'unknown' for other systems
 *
 * @example
 * ```ts
 * os()
 * //=> 'macos' // On macOS/Darwin systems
 * //=> 'windows' // On Windows systems
 * //=> 'unknown' // On other systems like Linux
 * ```
 */
const os = (): 'macos' | 'windows' | 'unknown' => {
  const { platform } = process
  if (typeof platform !== 'string') return 'unknown'
  const p = platform.toLowerCase()
  if (p.includes('darwin')) return 'macos'
  if (p.includes('win')) return 'windows'
  return 'unknown'
}

export default os
