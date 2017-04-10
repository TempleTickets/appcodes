# floppy

[![From bigpipe.io][from]](http://bigpipe.io)[![Version npm][version]](http://browsenpm.org/package/floppy)[![Build Status][build]](https://travis-ci.org/bigpipe/floppy)[![Dependencies][david]](https://david-dm.org/bigpipe/floppy)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/floppy?branch=master)

[from]: https://img.shields.io/badge/from-bigpipe.io-9d8dff.svg?style=flat-square
[version]: http://img.shields.io/npm/v/floppy.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/floppy/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/floppy.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/floppy/master.svg?style=flat-square

## Installation

The module is written with Browserify and Node.js in mind and is released in the
public npm registry. It can be installed by running:

```
npm install --save floppy
```

## Usage

In all examples we assume that you've required and constructed your floppy
instance as following:

```js
'use strict';

var Floppy = require('floppy')
  , file = new Floppy('//cdn.example.org/file.ext');
```

### floppy.eject

Remove a dependent from the floppy. If the floppy is still in use by something
it will prevent ejection and return false. Once all the last dependent is
removes it self the floppy will be fully eject and call `floppy.destroy`

```js
floppy.eject();
```

## License

MIT
