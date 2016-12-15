var Order = require('./order');
var MongoClient = require('mongodb');

var Factory = function(uri) {
  this.uri = uri;
  this.orders = [];
};

/**
 *
 * @param num
 * @param stub
 */
Factory.prototype.add = function (num, stub) { // possible to add arguments for the things according to
  var order = new Order(arguments);
  this.orders.push(order);
};

Factory.prototype.exec = function (cb) {
  var self = this;

  MongoClient.connect(this.uri, function (err, db) {
    self.orders.forEach(function (order) {
      var data = order.toArray();
      db.collection(order.stub.collection).insertMany(data, function (err) {
        if (err) throw err;
      });
    });

    // reset orders after executing all
    self.orders = [];
    cb(null);
  });
};

module.exports = Factory;
