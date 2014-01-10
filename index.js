/*! qtils 0.2.0 Copyright (c) 2014 Alan Plum. MIT licensed. @preserve */
var Q = require('q'),
  slice = Function.prototype.call.bind(Array.prototype.slice);

exports.eacharg = Qeacharg;
exports.allargs = Qallargs;
exports.tee = Qtee;
exports.append = Qappend;
exports.prepend = Qprepend;
exports.transform = Qtransform;

function Qeacharg() {
  var fns = slice(arguments, 0), n = fns.length;
  return function(arr) {
    return Q.all(arr.map(function(arg, i) {
      return fns[i % n](arg);
    }));
  };
}

function Qallargs() {
  var fns = slice(arguments, 0);
  return function(arg) {
    return Q.all(fns.map(function(fn) {
      return fn(arg);
    }));
  };
}

function Qtee(fn) {
  return function(arg) {
    return Q(fn(arg)).thenResolve(arg);
  };
}

function Qappend(fn) {
  return function(arg) {
    return Q(fn(arg)).then(function(result) {
      return Q.all((Array.isArray(arg) ? arg : [arg]).concat(result));
    });
  };
}

function Qprepend(fn) {
  return function(arg) {
    return Q(fn(arg)).then(function(result) {
      return Q.all((Array.isArray(result) ? result : [result]).concat(arg));
    });
  };
}

function Qtransform(props, keep) {
  return function(data) {
    var result = {};

    if (keep) {
      Object.keys(data).forEach(function(key) {
        result[key] = data[key];
      });
    }

    return Q.all(Object.keys(props).map(function(key) {
      return Q(props[key](data[key]))
      .then(function(value) {
        result[key] = value;
      });
    }))
    .thenResolve(result);
  };
}
