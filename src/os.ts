// function

/**
 * Get the current operating system.
 * @returns The operating system.
 * @example
 * ```
 * os()
 * //=> 'macos'
 * ```
 */
const os = () => {
  const { platform } = process
  if (platform.includes('darwin')) return 'macos'
  if (platform.includes('win')) return 'windows'
  return 'unknown'
}

// export
export default os
