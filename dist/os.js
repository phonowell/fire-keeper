var fn, os;

os = null;

fn = function() {
  var string;
  string = process.platform;
  if (~string.search('darwin')) {
    return 'macos';
  }
  if (~string.search('win')) {
    return 'windows';
  }
  return 'linux';
};

module.exports = function(name) {
  os || (os = fn());
  if (name) {
    return name === os;
  }
  return os; // return
};
