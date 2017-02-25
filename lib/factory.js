var Order = require('./order');
var MongoClient = require('mongodb').MongoClient;
var async = require('async');

var Factory = function(uri) {
  this.uri = uri;
  this.orders = [];
  this.collections = [];
};

/**
 * Getter for db object of native driver
 * @param cb
 */
Factory.prototype.getDB = function (cb) {
  MongoClient.connect(this.uri, function (err, db) {
    if (err) return cb(err);
    cb(null, db);
  });
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
 * Execute all pending orders in the factory
 * @param cb
 */
Factory.prototype.exec = function (cb) {
  var self = this;
  MongoClient.connect(this.uri, function (err, db) {
    var results = [];
    async.eachSeries(self.orders, function (order, cb) {
      var data = order.toArray();
      results = results.concat(data);
      db.collection(order.stub.collection).insertMany(data, function (err) {
        if (err) return cb(err);
        cb(null);
      });
    }, function (err) { /* all iteree functions have finished */
      if (err) return cb(err);

      self.orders = [];
      cb(null, results);
    });
  });
};

/**
 * Delete all documents
 * @param cb
 *
 * The reason why we don't drop the collection or database is to preserve
 * indices for during tests.
 */
function cleanup(cb) {
  var self = this;
  MongoClient.connect(this.uri, function (err, db) {

    async.eachSeries(self.collections, function (coll, cb) {
      db.collection(coll).deleteMany({}, function (err) {
        if (err) return cb(err);
        cb(null);
      })
    }, function (err) {
      if (err) return cb(err);
      self.collections = [];
      cb(null);
    });
  });
}

Factory.prototype.cleanup = cleanup;

/**
 * For backward compatibility reasons, v1.0.10 or lower
 */
Factory.prototype.cleanUp = cleanup;

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
