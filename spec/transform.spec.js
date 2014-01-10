/*global describe, it */
var expect = require('expect.js'),
  Q = require('q'),
  transform = require('../').transform;

describe('qtils.transform(props)', function() {
  it('is a function', function() {
    expect(transform()).to.be.a('function');
  });
  it('returns a promise resolving to an object', function(done) {
    Q({})
    .then(transform({}))
    .done(function(result) {
      expect(result).to.be.an('object');
      done();
    });
  });
  it('returns a promise that is rejected when a transformation throws', function(done) {
    Q({foo: 'bar'})
    .then(transform({foo: function() {throw new Error('Fail');}}))
    .done(null, function(reason) {
      expect(reason).to.be.an(Error);
      done();
    });
  });
  it('returns a promise that is rejected when a transformation rejects', function(done) {
    Q({foo: 'bar'})
    .then(transform({foo: function() {return Q.reject(new Error('Fail'));}}))
    .done(null, function(reason) {
      expect(reason).to.be.an(Error);
      done();
    });
  });
  it('calls each function with the property value as argument', function(done) {
    var called = {foo: false, bar: false, qux: false};
    Q({foo: 'x', bar: 'y', qux: 'z'})
    .then(transform({
      foo: function(x) {called.foo = x;},
      bar: function(y) {called.bar = y;}
    }))
    .done(function() {
      expect(called.foo).to.equal('x');
      expect(called.bar).to.equal('y');
      expect(called.qux).to.equal(false);
      done();
    });
  });
  it('returns a promise resolving to the transformation result', function(done) {
    Q({foo: 'x', bar: 'y', qux: 'z'})
    .then(transform({
      foo: function(x) {return x.toUpperCase();},
      bar: function(y) {return y.toUpperCase();}
    }))
    .done(function(result) {
      expect(result.foo).to.equal('X');
      expect(result.bar).to.equal('Y');
      expect(result).to.not.have.property('qux');
      done();
    });
  });
  it('transforms missing properties, too', function(done) {
    Q({foo: 'x'})
    .then(transform({
      foo: function(x) {return x.toUpperCase();},
      bar: function(y) {return y ? true : false;}
    }))
    .done(function(result) {
      expect(result.foo).to.equal('X');
      expect(result).to.have.property('bar');
      expect(result.bar).to.equal(false);
      done();
    });
  });
});

describe('qtils.transform(props, true)', function() {
  it('passes on properties that have no transformations', function(done) {
    Q({foo: 'x', bar: 'y', qux: 'z'})
    .then(transform({
      foo: function(x) {return x.toUpperCase();},
      bar: function(y) {return y.toUpperCase();}
    }, true))
    .done(function(result) {
      expect(result.foo).to.equal('X');
      expect(result.bar).to.equal('Y');
      expect(result.qux).to.equal('z');
      done();
    });
  });
});