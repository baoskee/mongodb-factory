/**
 * Creates a stub that will execute definition for method new()
 * @param definition - function that will call for every new() invocation
 * @param collection - name of mongoDB collection
 * @returns {Stub}
 * @constructor
 */
var Stub = function (definition, collection) {
  this.definition = definition;
  this.collection = collection;
  return this;
};

/**
 * Method to invoke the stub definition
 * @returns {*}
 */
Stub.prototype.new = function () {
  return this.definition.apply(this, arguments);
};

module.exports = Stub;
