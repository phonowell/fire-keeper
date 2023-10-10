// function

const main = () => {
  const { platform } = process
  if (platform.includes('darwin')) return 'macos'
  if (platform.includes('win')) return 'windows'
  return 'unknown'
}

// export
export default main
