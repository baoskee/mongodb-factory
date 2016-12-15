var should = require('chai').should();
var Stub = require('../lib/stub');
var Order = require('../lib/order');

describe('Order', function () {
  var _order;
  var _num = 100;
  var _arg1 = "Some argument";
  var _arg2 = 412;
  var _userStub;
  beforeEach(function (done) {
    _userStub = new Stub(function (options) {
      return {
        username: (options && options.username) || 'baoskee',
        password: (options && options.password) || 'foobar'
      }
    }, 'users');
    _order = new Order(_num, _userStub, _arg1, _arg2);
    done();
  });

  it('constructor should have arguments of num, stub, args', function (done) {
    _order.num.should.equal(_num);
    _order.stub.should.equal(_userStub);
    _order._args[0].should.equal(_arg1);
    _order._args[1].should.equal(_arg2);
    done();
  });

  it('toArray() should return an array of new stub documents', function (done) {
    var data = _order.toArray();
    data.length.should.equal(_num);
    data.forEach(function (user) {
      user.username.should.equal('baoskee');
      user.password.should.equal('foobar');
    });
    done(); 
  });

  it('toArray() should pass arguments to its stub definition', function (done) {
    var order = new Order(200, _userStub, { username: 'ratatouille', password: 'potato'});
    var data = order.toArray();
    data.forEach(function (user) {
      user.username.should.equal('ratatouille');
      user.password.should.equal('potato');
    });
    done();
  });
});