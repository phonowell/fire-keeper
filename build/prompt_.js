(function() {
  var indexOf = [].indexOf;

  module.exports = function($) {
    var Prompt, _;
    ({_} = $);
    Prompt = (function() {
      class Prompt {
        async execute_(option) {
          var res, resRaw, type;
          type = $.type(option);
          if (type !== 'object') {
            throw new Error(`invalid type '${type}'`);
          }
          $.info.pause(this.namespace);
          option = _.cloneDeep(option);
          option = (await this.setOption_(option));
          
          // execute
          this.fn_ || (this.fn_ = require('prompts'));
          resRaw = (await this.fn_(option));
          res = resRaw[option.name];
          await this.setCache_(option, res);
          $.info.resume(this.namespace);
          
          // return
          if (option.raw) {
            return resRaw;
          }
          return res;
        }

        async getCache_(option) {
          var cache, index, item, ref, type, value;
          if (!option.id) {
            return void 0;
          }
          if (ref = option.type, indexOf.call(this.listTypeCache, ref) < 0) {
            return void 0;
          }
          cache = (await $.read_(this.pathCache));
          if (!(item = _.get(cache, option.id))) {
            return void 0;
          }
          ({type, value} = item);
          if (type !== option.type) {
            return void 0;
          }
          
          // return
          if (type === 'select') {
            index = _.findIndex(option.choices, {value});
            if (!(index > -1)) {
              return void 0;
            }
            return index;
          }
          return value;
        }

        async setCache_(option, value) {
          var cache, id, type;
          ({id, type} = option);
          if (!(id && (value != null) && indexOf.call(this.listTypeCache, type) >= 0)) {
            return this;
          }
          cache = (await $.read_(this.pathCache));
          cache || (cache = {});
          cache[option.id] = {type, value};
          await $.write_(this.pathCache, cache);
          return this;
        }

        async setOption_(option) {
          var i, item, j, len, ref, ref1, ref2;
          if (ref = option.type, indexOf.call(this.listType, ref) < 0) {
            throw new Error(`invalid type '${option.type}'`);
          }
          
          // default value
          option.message || (option.message = this.mapMessage[option.type] || 'input');
          option.name || (option.name = 'value');
          if ((ref1 = option.type) === 'autocomplete' || ref1 === 'multiselect' || ref1 === 'select') {
            if (!(option.choices || (option.choices = option.choice || option.list))) {
              throw new Error('got no choice(s)');
            }
            ref2 = option.choices;
            for (i = j = 0, len = ref2.length; j < len; i = ++j) {
              item = ref2[i];
              if ('object' === $.type(item)) {
                continue;
              }
              option.choices[i] = {
                title: item,
                value: item
              };
            }
          } else if (option.type === 'toggle') {
            option.active || (option.active = 'on');
            option.inactive || (option.inactive = 'off');
          }
          
          // have to be here
          // behind option.choices
          option.initial || (option.initial = option.default || (await this.getCache_(option)));
          return option; // return
        }

      };

      /*
      listType
      listTypeCache
      mapMessage
      namespace
      pathCache
      ---
      execute_(option)
      getCache_(option)
      setCache_(option, value)
      setOption_(option)
      */
      Prompt.prototype.listType = ['autocomplete', 'confirm', 'multiselect', 'number', 'select', 'text', 'toggle'];

      Prompt.prototype.listTypeCache = ['autocomplete', 'confirm', 'number', 'select', 'text', 'toggle'];

      Prompt.prototype.mapMessage = {
        confirm: 'confirm',
        multiselect: 'select',
        number: 'input number',
        select: 'select',
        text: 'input text',
        toggle: 'toggle'
      };

      Prompt.prototype.namespace = '$.prompt_';

      Prompt.prototype.pathCache = './temp/cache-prompt.json';

      return Prompt;

    }).call(this);
    
    // return
    return $.prompt_ = async function(...arg) {
      var base, prompt_;
      prompt_ = (base = $.prompt_).fn_ || (base.fn_ = new Prompt());
      return (await prompt_.execute_(...arg));
    };
  };

}).call(this);
