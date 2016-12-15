var should = require('chai').should();
var Stub = require('../lib/stub');

describe('Stub', function () {
  var _userStub;
  beforeEach(function (done) {
    _userStub = new Stub(function (options) {
      return {
        username: (options && options.username) || 'baoskee',
        password: (options && options.password) || 'foobar'
      }
    }, 'users');
    done();
  });

  it('new() should exhibit correct default behavior', function (done) {
    var user = _userStub.new();
    user.username.should.equal('baoskee');
    user.password.should.equal('foobar');
    done();
  });

  it('new() should pass in arguments to its definition function', function (done) {
    var user = _userStub.new({ username: 'ratatouille', password: 'potato' });
    user.username.should.equal('ratatouille');
    user.password.should.equal('potato');
    done();
  });

});