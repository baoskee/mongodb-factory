var Order = require('./order');
var MongoClient = require('mongodb').MongoClient;

var Factory = function(uri) {
  this.uri = uri;
  this.orders = [];
  this.collections = [];
};

/**
 * Passes arguments to Order object
 * @param num
 * @param stub
 * Can add extra arguments which will be passed to your stub object
 */

Factory.prototype.add = function (num, stub) {
  var args = [null].concat([].slice.call(arguments));
  var order = new (Function.prototype.bind.apply(Order, args));

  // actually factory logic
  this.orders.push(order);
  if (!this.collections.includes(stub.collection)) {
    this.collections.push(stub.collection);
  }

  return this;
};

/**
 * Expose the Stub class
 * @type {Stub}
 */
Factory.Stub = require('./stub');

/**
 * Execute all pending orders in the factory
 * @param cb
 */
Factory.prototype.exec = function (cb) {
  var self = this;
  var results = [];
  MongoClient.connect(this.uri, function (err, db) {
    self.orders.forEach(function (order) {
      var data = order.toArray();
      results = results.concat(data);
      db.collection(order.stub.collection).insertMany(data, function (err) {
        if (err) return cb(err);
      });
    });

    // reset orders after executing all
    self.orders = [];
    cb(null, results);
  });
};

/**
 * Delete all documents
 * @param cb
 *
 * The reason why we don't drop the collection or database is to preserve
 * indices for during tests.
 */
Factory.prototype.cleanUp = function (cb) {
  var self = this;
  MongoClient.connect(this.uri, function (err, db) {
    self.collections.forEach(function (coll) {
      db.collection(coll).deleteMany({}, function (err) {
        if (err) return cb(err);
        cb(null);
      })
    });
    // reset collections after executing all
    self.collections = [];
  });
};

Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
  'use strict';
  var O = Object(this);
  var len = parseInt(O.length) || 0;
  if (len === 0) {
    return false;
  }
  var n = parseInt(arguments[1]) || 0;
  var k;
  if (n >= 0) {
    k = n;
  } else {
    k = len + n;
    if (k < 0) {k = 0;}
  }
  var currentElement;
  while (k < len) {
    currentElement = O[k];
    if (searchElement === currentElement ||
      (searchElement !== searchElement && currentElement !== currentElement)) {
      return true;
    }
    k++;
  }
  return false;
};

module.exports = Factory;
