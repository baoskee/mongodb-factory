var Order = require('./order');
var MongoClient = require('mongodb').MongoClient;

var Factory = function(uri) {
  this.uri = uri;
  this.orders = [];
  this.collections = [];
};

/**
 *
 * @param num
 * @param stub
 */
Factory.prototype.add = function (num, stub) { // possible to add arguments for the things according to
  // TODO: Pass all arguments in here
  var order = new Order(arguments[0], arguments[1], arguments[2], arguments[3]);
  this.orders.push(order);
  // TODO: Only push if collections does not already have the name
  this.collections.push(stub.collection);

  return this;
};

/**
 * 
 * @type {Stub}
 */
Factory.Stub = require('./stub');

/**
 *
 * @param cb
 */
Factory.prototype.exec = function (cb) {
  var self = this;

  MongoClient.connect(this.uri, function (err, db) {
    self.orders.forEach(function (order) {
      var data = order.toArray();
      db.collection(order.stub.collection).insertMany(data, function (err) {
        if (err) return cb(err);
      });
    });

    // reset orders after executing all
    self.orders = [];
    cb(null);
  });
};

Factory.prototype.cleanUp = function (cb) {
  var self = this;
  MongoClient.connect(this.uri, function (err, db) {
    // TODO: Should clear all collections
    db.collection(self.collections[0]).deleteMany({}, function (err) {
      if (err) return cb(err);
      cb(null);
    })
  });
};

module.exports = Factory;
