import { $, temp } from './index'

// function

const a = async () => {
  await $.download('//www.baidu.com', temp, 'baidu.html')
  if (!(await $.isExist(`${temp}/baidu.html`))) throw new Error('0')
}

const b = async () => {
  await $.download('//www.baidu.com', temp, {
    filename: 'baidu.html',
    timeout: 1e4,
  })
  if (!(await $.isExist(`${temp}/baidu.html`))) throw new Error('0')
}

// export
export { a, b }
