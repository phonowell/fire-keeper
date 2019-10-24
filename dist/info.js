var $, M, _, kleur, m;

$ = {};

$.root = require('../dist/root');

$.home = require('../dist/home');

$.parseString = require('../dist/parseString');

$.i = require('../dist/i');

_ = {};

_.trim = require('lodash/trim');

_.padStart = require('lodash/padStart');

_.floor = require('lodash/floor');

_.repeat = require('lodash/repeat');

kleur = require('kleur');

M = (function() {
  class M {
    execute(...arg) {
      var msg, text, type;
      if (!arg.length) {
        return this;
      }
      [type, text] = (function() {
        switch (arg.length) {
          case 1:
            return ['default', arg[0]];
          case 2:
            return arg;
          default:
            throw new Error('info/error: invalid argument length');
        }
      })();
      if (this.$isSilent) {
        return text;
      }
      msg = _.trim($.parseString(text));
      if (!msg.length) {
        return text;
      }
      $.i(this.render(type, msg));
      return text; // return
    }

    getStringTime() {
      var date, item, listTime;
      date = new Date();
      listTime = [date.getHours(), date.getMinutes(), date.getSeconds()];
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = listTime.length; i < len; i++) {
          item = listTime[i];
          // return
          results.push(_.padStart(item, 2, 0));
        }
        return results;
      })()).join(':');
    }

    pause() {
      return this.$isSilent = true;
    }

    render(type, string) {
      return [this.renderTime(), this['$separator'], this.renderType(type), this.renderContent(string)].join('');
    }

    renderContent(string) {
      var msg;
      // 'xxx'
      msg = this.renderPath(string).replace(/'.*?'/g, function(text) {
        var cont;
        cont = text.replace(/'/g, '');
        if (!cont.length) {
          return "''";
        }
        return kleur.magenta(cont);
      });
      return msg; // return
    }

    renderPath(string) {
      return string.replace(this['$reg-root'], '.').replace(this['$reg-home'], '~');
    }

    renderTime() {
      var cache, stringTime, ts;
      cache = this['$cache-time'];
      ts = _.floor(new Date().getTime(), -3);
      if (ts === cache[0]) {
        return cache[1];
      }
      cache[0] = ts;
      stringTime = kleur.gray(`[${this.getStringTime()}]`);
      // return
      return cache[1] = `${stringTime} `;
    }

    renderType(type) {
      var base;
      type = _.trim($.parseString(type)).toLowerCase();
      return (base = this['$cache-type'])[type] || (base[type] = (function() {
        var stringContent, stringPad;
        if (type === 'default') {
          return '';
        }
        stringContent = kleur.cyan().underline(type);
        stringPad = _.repeat(' ', 10 - type.length);
        return `${stringContent}${stringPad
    // return
} `;
      })());
    }

    resume() {
      return this.$isSilent = false;
    }

    async silence_(fn_) {
      var result;
      this.$isSilent = true;
      result = (await (typeof fn_ === "function" ? fn_() : void 0));
      this.$isSilent = false;
      return result; // return
    }

  };

  /*
  $cache-time
  $cache-type
  $isSilent
  $reg-home
  $reg-root
  $separator
  ---
  execute(arg...)
  getStringTime()
  pause()
  render(type, string)
  renderContent(string)
  renderPath(string)
  renderTime()
  renderType(type)
  resume()
  silence_(fn_)
  */
  M.prototype['$cache-time'] = [];

  M.prototype['$cache-type'] = {};

  M.prototype['$isSilent'] = false;

  M.prototype['$reg-root'] = new RegExp(`^${$.root()}`, 'g');

  M.prototype['$reg-home'] = new RegExp(`^${$.home()}`, 'g');

  M.prototype['$separator'] = `${kleur.gray('›')} `;

  return M;

}).call(this);


// return
m = new M();

module.exports = function(...arg) {
  return m.execute(...arg);
};
