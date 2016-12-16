var MONGO_URI = 'mongodb://localhost/test';
var MongoClient = require('mongodb').MongoClient;
var Factory = require('../index');
var should = require('chai').should();
var Stub = require('../lib/stub');

describe('Factory', function () {
  var userStub = new Stub(function (options) {
    return {
      username: (options && options.username) || 'baoskee',
      password: (options && options.password) || 'foobar'
    }
  }, 'users');
  var tweetStub = new Stub(function () {
    return {
      content: 'Just setting up my twttr'
    }
  }, 'tweets');
  var factory = new Factory(MONGO_URI);
  var data = { username: 'something', password: 'lmfao' };

  beforeEach(function (done) {
    done();
  });

  afterEach(function (done) {
    factory.cleanUp(function (err) {
      if (err) throw err;
      done();
    });
  });

  it('should populate current plan', function (done) {
    factory.add(100, userStub, data).add(200, userStub, data);
    factory.exec(function (err, users) {
      if (err) throw err;
      users.length.should.equal(300);
      users.forEach(function (user) {
        user.username.should.equal(data.username);
        user.password.should.equal(data.password);
      });

      MongoClient.connect(MONGO_URI, function (err, db) {
        if (err) throw err;
        db.collection('users').find({}).toArray(function (err, users) {
          if (err) throw err;

          users.length.should.equal(300);
          users.forEach(function (user) {
            user.username.should.equal(data.username);
            user.password.should.equal(data.password);
          });
          done();
        });
      });
    });
  });

  describe('Testing cleanUp', function () {
    beforeEach(function (done) {
      factory.add(10, userStub).add(10, tweetStub).exec(function (err, docs) {
        if (err) throw err;
        docs.length.should.equal(20);
        done();
      });
    });

    it('cleanUp() should delete all docs from all collections', function (done) {
      factory.cleanUp(function (err) {
        if (err) throw err;

        MongoClient.connect(MONGO_URI, function (err, db) {
          db.collection('tweets').find({}).toArray(function (err, tweets) {
            if (err) throw err;
            tweets.length.should.equal(0);
            db.collection('users').find({}).toArray(function (err, users) {
              if (err) throw err;
              users.length.should.equal(0);
              done();
            });
          });
        });
      });
    });

    it('getDB() should return database object', function (done) {
      factory.getDB(function (err, db) {
        if (err) throw err;
        should.exist(db);
        done();
      });
    });
  });

});

