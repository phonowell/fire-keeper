/**
 * Detect the current operating system
 * @returns OS identifier: 'macos', 'windows', 'linux', or 'unknown'
 * @example
 * os() // 'macos' (on macOS), 'windows' (on Windows), 'linux' (on Linux)
 */
const os = (): 'macos' | 'windows' | 'linux' | 'unknown' => {
  const { platform } = process
  if (typeof platform !== 'string') return 'unknown'
  const p = platform.toLowerCase()
  if (p.includes('darwin')) return 'macos'
  if (p.includes('win')) return 'windows'
  if (p.includes('linux')) return 'linux'
  return 'unknown'
}

export default os
