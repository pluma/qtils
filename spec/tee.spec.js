/*global describe, it */
var expect = require('expect.js'),
  Q = require('q'),
  tee = require('../').tee;

describe('qtils.tee(fn)', function() {
  it('is a function', function() {
    expect(tee()).to.be.a('function');
  });
  it('returns a promise resolving to its input', function(done) {
    Q(5)
    .then(tee(function() {}))
    .done(function(result) {
      expect(result).to.equal(5);
      done();
    });
  });
  it('returns a promise that is rejected when the tee fails', function(done) {
    Q(5)
    .then(tee(function() {throw new Error('Fail');}))
    .done(null, function(reason) {
      expect(reason).to.be.an(Error);
      done();
    });
  });
  it('calls the passed function', function(done) {
    var called = false;
    Q()
    .then(tee(function() {called = true;}))
    .done(function() {
      expect(called).to.equal(true);
      done();
    });
  });
});