var Order = function (num, stub) {
  this.num = num;
  this.stub = stub;
  this._args = arguments.slice(2);
};

/**
 * Returns array of stubs
 * @param cb - has first error argument
 */
Order.prototype.exec = function (cb) {
  var results = [];
  for (var i = 0; i < this.num; i++) {
    results.push(this.stub.new(this._args));
  }
  
  cb(null, results);
};

module.exports = Order;
