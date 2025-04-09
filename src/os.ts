/**
 * Gets the current operating system identifier
 * @returns Operating system identifier: 'macos' for macOS/Darwin, 'windows' for Windows, or 'unknown' for other systems
 *
 * @example Operating system detection
 * ```ts
 * os()
 * //=> 'macos' // On macOS/Darwin systems
 * //=> 'windows' // On Windows systems
 * //=> 'unknown' // On other systems like Linux
 * ```
 *
 * Features:
 * - Platform-specific identification using process.platform
 * - Consistent lowercase return values
 * - Handles both desktop and server variants
 * - Graceful fallback to 'unknown' for unsupported platforms
 */
const os = () => {
  const { platform } = process
  if (platform.includes('darwin')) return 'macos'
  if (platform.includes('win')) return 'windows'
  return 'unknown'
}

export default os
