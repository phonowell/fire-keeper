var $, Lang, _;

$ = {};

$.formatArgument = require('../dist/formatArgument');

$.info = require('../dist/info');

$.os = require('../dist/os');

$.parseString = require('../dist/parseString');

$.exec_ = require('../dist/exec_');

_ = {};

_.trim = require('lodash/trim');

Lang = {
  'ja': 'kyoko',
  'ja-jp': 'kyoko',
  'zh': 'ting-ting',
  'zh-cn': 'ting-ting',
  'zh-hk': 'sin-ji',
  'zh-tw': 'mei-jia'
};

module.exports = async function(text, option = {}) {
  var i, lang, len, listCmd, msg, name, ref, voice;
  ref = $.formatArgument(text);
  for (i = 0, len = ref.length; i < len; i++) {
    msg = ref[i];
    $.info('say', msg);
    if (!$.os('macos')) {
      continue;
    }
    msg = $.parseString(msg).replace(/[#\(\)-]/g, '');
    msg = _.trim(msg);
    if (!msg.length) {
      continue;
    }
    listCmd = ['say'];
    if (option.lang) {
      lang = option.lang.toLowerCase();
      if (name = Lang[lang]) {
        lang = name;
      }
      listCmd.push(`--voice=${lang}`);
    }
    if (option.voice) {
      voice = option.voice.toLowerCase();
      listCmd.push(`--voice=${voice}`);
    }
    listCmd.push(msg);
    await $.exec_(listCmd.join(' '), {
      silent: true
    });
  }
  return this;
};
