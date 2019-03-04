(function() {
  module.exports = function($) {
    var _;
    ({_} = $);
    $.say_ = async function(text, option = {}) {
      var i, lang, len, listCmd, listMessage, msg, name, type, voice;
      type = $.type(text);
      listMessage = (function() {
        switch (type) {
          case 'array':
            return text;
          case 'boolean':
          case 'number':
          case 'string':
            return [text];
          default:
            throw new Error(`invalid type '${type}'`);
        }
      })();
      for (i = 0, len = listMessage.length; i < len; i++) {
        msg = listMessage[i];
        $.info('say', msg);
        if ($.os !== 'macos') {
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
          if (name = $.say_.mapLang[lang]) {
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
      return $; // return
    };
    $.say_.mapLang = {
      'ja': 'kyoko',
      'ja-jp': 'kyoko',
      'zh': 'ting-ting',
      'zh-cn': 'ting-ting',
      'zh-hk': 'sin-ji',
      'zh-tw': 'mei-jia'
    };
    return $.say_; // return
  };

}).call(this);
