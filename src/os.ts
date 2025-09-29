/**
 * Detect the current operating system
 * @returns OS identifier: 'macos', 'windows', or 'unknown'
 * @example
 * os() // 'macos' (on macOS), 'windows' (on Windows), 'unknown' (on Linux)
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
