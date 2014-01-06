/*global describe, it */
var expect = require('expect.js'),
  tee = require('../').tee;

describe('qtils.tee(fn)', function() {
  it('is a function', function() {
    expect(tee()).to.be.a('function');
  });
  it('returns a promise resolving to its input', function(done) {
    tee(function() {})(5)
    .done(function(result) {
      expect(result).to.equal(5);
      done();
    });
  });
  it('calls the passed function', function(done) {
    var called = false;
    tee(function() {called = true;})()
    .done(function() {
      expect(called).to.equal(true);
      done();
    });
  });
});