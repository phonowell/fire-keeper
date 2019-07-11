export default (ipt) ->

  Object::toString.call ipt
  .replace /^\[object (.+)]$/, '$1'
  .toLowerCase()