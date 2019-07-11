var $;

$ = {};

$.type = require('../dist/type');

module.exports = function(ipt) {
  switch ($.type(ipt)) {
    case 'array':
      return (JSON.stringify({
        __container__: ipt
      })).replace(/{(.*)}/, '$1').replace(/"__container__":/, '');
    case 'object':
      return JSON.stringify(ipt);
    case 'string':
      return ipt;
    default:
      if (ipt.toString) {
        return ipt.toString();
      }
      return new String(ipt);
  }
};
