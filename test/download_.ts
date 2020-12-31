import { $, temp } from './index'

// function

async function a_(): Promise<void> {

  await $.download_('//www.baidu.com', temp, 'baidu.html')
  if (!await $.isExisted_(`${temp}/baidu.html`)) throw new Error('0')
}

async function b_(): Promise<void> {

  await $.download_('//www.baidu.com', temp, {
    filename: 'baidu.html',
    timeout: 1e4,
  })
  if (!await $.isExisted_(`${temp}/baidu.html`)) throw new Error('0')
}

// export
export {
  a_,
  b_,
}
