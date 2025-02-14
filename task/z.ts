import { download, echo, getName } from '../src'

const main = async () => {
  echo(getName('https://example.com/file.txt'))
  await download('http://www.baidu.com/', '~/Downloads', 'baidu.html')
}

export default main
