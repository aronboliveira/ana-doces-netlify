const handler = {
  get(target, prop) {
    return prop;
  }
};
module.exports = new Proxy({}, handler);
module.exports.__esModule = true;
module.exports.default = new Proxy({}, handler);
