var OriginalSource = require('webpack/lib/OriginalSource');

module.exports = function(source, map){
  var identifier = this._module.identifier();

  this.cacheable();

  var origMap = this.sourceMap ? new OriginalSource(source, identifier, map) : null;

  var globalPrefix = '@import "~ssAppGlobalStylus.styl";\n';
  source = globalPrefix + source;
  if (origMap) {
    origMap.node().prepend(globalPrefix);
  }

  return this.callback(null, source, origMap ? origMap.map() : null);
};
