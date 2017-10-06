**NOTE:** This package is no longer being maintained. If you are interested in taking over as maintainer or are interested in the npm package name, get in touch by creating an issue.

# Synopsis

**qtils** is a utility library for [Q](https://github.com/kriskowal/q).

[![Build Status](https://travis-ci.org/pluma/qtils.png?branch=master)](https://travis-ci.org/pluma/qtils) [![NPM version](https://badge.fury.io/js/qtils.png)](http://badge.fury.io/js/qtils) [![Dependencies](https://david-dm.org/pluma/qtils.png)](https://david-dm.org/pluma/qtils)

# Note

When dealing with multiple arguments in Q, it is customary to pass them around as arrays. Until EcmaScript 6 destructuring becomes widely available, this makes Q control flows with multiple promises a bit unpractical when you can't use `.spread`.

If you find yourself using `.spread` a lot but still want to give the array manipulation helpers in this library a try, consider using [spread-args](https://github.com/pluma/spread-args) to convert functions that take positional arguments into functions that accept a simple argument array.

# Install

## With NPM

```sh
npm install qtils
```

## From source

```sh
git clone https://github.com/pluma/qtils.git
cd qtils
npm install
make test
```

# API

## append(fn:Function):Function

Creates a function that will pass its argument to the given function and returns a promise that will be resolved to the function's result appended to the argument.

If the argument is not an `Array`, it will be wrapped in one before the result is appended.

Example:

```javascript
Q('foo')
.then(qtils.append(function(str) {
    return str.replace('f', 'b');
}))
.then(console.log); // ['foo', 'boo']
```

## prepend(fn:Function):Function

Creates a function that will pass its argument to the given function and returns a promise that will be resolved to the function's result prepended to the argument.

If the argument is not an `Array`, it will be wrapped in one before the result is prepended.

Example:

```javascript
Q('foo')
.then(qtils.prepend(function(str) {
    return str.replace('f', 'b');
}))
.then(console.log); // ['boo', 'foo']
```

## tee(fn:Function):Function

Creates a function that will pass its argument to the given function and returns a promise that will be resolved to the argument when the function's result is fulfilled.

In other words, `tee` allows you to add `then`able side-effects to a promise chain (without having to modify them so they return their inputs).

Example without `tee`:

```javascript
Q('foo')
.then(function(str) {
    console.log('Result is:', str); // 'Result is: "foo"'
    return str; // Must return the input or next `then` will see `null`
})
.then(console.log); // 'foo'
```

Example with `tee`:

```javascript
Q('foo')
.then(qtils.tee(function(str) {
    console.log('Result is:', str); // 'Result is: "foo"'
}))
.then(console.log); // 'foo'
```

## eacharg(fns...):Function

Creates a function that will pass each item in an array to each function and returns a promise that will be resolved to an array containing the results.

If the number of functions is smaller than the number of items in the array, it will loop over the functions.

Example:

```javascript
Q(['Foo', 'Bar', 'Qux'])
.then(qtils.eacharg(
    function(str) {return str.toUpperCase();},
    function(str) {return str.toLowerCase();}
))
.then(console.log); // ['FOO', 'bar', 'QUX']
```

## allargs(fns...):Function

Creates a function that will pass its argument to each function and returns a promise that will be resolved to an array containing the results.

Example:

```javascript
Q(['foo', 'bar', 'qux'])
.then(qtils.allargs(
    function(arr) {return arr.join('-');},
    function(arr) {return arr.join('+');}
))
.then(console.log); // ['foo-bar-qux', 'foo+bar+qux']
```

## transform(props:Object, [opts]):Function

Creates a function that takes an object and will apply the given transformations to its properties and then returns a promise resolving to the result object.

Example:

```javascript
var person = {firstName: 'John', lastName: 'Doe'};
Q(person)
.then(qtils.transform({
    lastName: function(str) {return str.toUpperCase();}
}))
.then(function(result) {
    console.log(result); // {lastName: 'DOE'}
    console.log(person); // {firstName: 'John', lastName: 'Doe'}
});
```

If a transformation is not a function, it will be passed through as the transformation result for that property:

```javascript
Q({foo: 'x', bar: 'y'})
.then(qtils.transform({
    foo: 'static',
    bar: 5
}, true))
.then(function(result) {
    console.log(result.foo); // 'static'
    console.log(result.bar); // 5
});
```

### opts.keep:Boolean (default: false)

If `keep` is `true`, any properties that have no matching transformation will be copied to the result object verbatim. Otherwise they will be omitted.

Example with `keep = true`:

```javascript
var person = {firstName: 'John', lastName: 'Doe'};
Q(person)
.then(qtils.transform({
    lastName: function(str) {return str.toUpperCase();}
}, {keep: true}))
.then(function(result) {
    console.log(result); // {firstName: 'John', lastName: 'DOE'}
    console.log(person); // {firstName: 'John', lastName: 'Doe'}
});
```

### opts.skipMissing:Boolean (default: false)

If `keepMissing` is `true`, any properties missing on the object will be omitted. Otherwise their transformations will be executed as if they were set to `undefined`.

Example with `skipMissing = true`:

```javascript
Q({})
.then(qtils.transform({
    bar: function(str) {return str.toUpperCase();}
}, {skipMissing: true}))
.then(console.log); // {}
```

Example with `skipMissing = false`:

```javascript
Q({})
.then(qtils.transform({
    bar: function(x) {return x;}
}, {skipMissing: false}))
.then(console.log); // {bar: undefined}
```

# License

The MIT/Expat license.
