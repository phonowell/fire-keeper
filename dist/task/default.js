var $, _,
  indexOf = [].indexOf;

$ = {};

$.task = require('../../dist/task');

$.info = require('../../dist/info');

$.wrapList = require('../../dist/wrapList');

$.prompt_ = require('../../dist/prompt_');

_ = {};

_.keys = require('lodash/keys');

module.exports = async function() {
  var list, name;
  list = _.keys($.task());
  list.sort();
  $.info('task', $.wrapList(list));
  name = (await $.prompt_({
    id: 'default-gulp',
    type: 'autocomplete',
    list: list,
    message: 'task'
  }));
  if (indexOf.call(list, name) < 0) {
    throw new Error(`task/default/error: invalid task '${name}'`);
  }
  await $.task(name)();
  return this;
};
