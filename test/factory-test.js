var MONGO_URI = 'mongodb://localhost/test';
var MongoClient = require('mongodb').MongoClient;
var Factory = require('../index');
var should = require('chai').should();
var Stub = require('../lib/stub');

describe('Factory', function () {
  var factory = new Factory(MONGO_URI);
  beforeEach(function (done) {
    var userStub = new Stub(function (options) {
      return {
        username: (options && options.username) || 'baoskee',
        password: (options && options.password) || 'foobar'
      }
    }, 'users');
    factory.add(100, userStub)
      .add(200, userStub);
    done();
  });

  afterEach(function (done) {
    factory.cleanUp(function (err) {
      if (err) throw err;
      done();
    });
  });

  it('should populate current plan', function (done) {
    factory.exec(function (err) {
      if (err) throw err;

      MongoClient.connect(MONGO_URI, function (err, db) {
        if (err) throw err;
        db.collection('users').find({}).toArray(function (err, users) {
          if (err) throw err;

          users.length.should.equal(300);
          done();
        });
      });
    });
  });
});

