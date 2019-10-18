var fn, os;

os = null;

fn = function() {
  var string;
  string = process.platform;
  if (string.includes('darwin')) {
    return 'macos';
  }
  if (string.includes('win')) {
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
