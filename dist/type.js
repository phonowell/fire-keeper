module.exports = function(ipt) {
  return Object.prototype.toString.call(ipt).replace(/^\[object (.+)]$/, '$1').toLowerCase();
};
