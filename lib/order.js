var Order = function (num, stub) {
  this.num = num;
  this.stub = stub;

  var argumentsArray = [].slice.apply(arguments);
  this._args = argumentsArray.slice(2);
};

/**
 * Returns array of stubs
 */
Order.prototype.toArray = function () {
  var results = [];
  for (var i = 0; i < this.num; i++) {
    results.push(this.stub.new(this._args));
  }
  
  return results
};

module.exports = Order;
