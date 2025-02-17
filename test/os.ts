import { $ } from './index'

const tests = {
  // Test function exists
  functionExists: () => {
    if (typeof $.os !== 'function') throw new Error('os should be a function')
  },

  // Test macOS detection
  macOS: () => {
    const originalPlatform = process.platform
    Object.defineProperty(process, 'platform', { value: 'darwin' })

    if ($.os() !== 'macos') throw new Error('Should detect macOS')

    Object.defineProperty(process, 'platform', { value: originalPlatform })
  },

  // Test Windows detection
  windows: () => {
    const originalPlatform = process.platform
    Object.defineProperty(process, 'platform', { value: 'win32' })

    if ($.os() !== 'windows') throw new Error('Should detect Windows')

    Object.defineProperty(process, 'platform', { value: originalPlatform })
  },

  // Test unknown OS detection
  unknown: () => {
    const originalPlatform = process.platform
    Object.defineProperty(process, 'platform', { value: 'linux' })

    if ($.os() !== 'unknown')
      throw new Error('Should return unknown for other OS')

    Object.defineProperty(process, 'platform', { value: originalPlatform })
  },
}

export const a = () => {
  Object.values(tests).forEach(test => test())
}
