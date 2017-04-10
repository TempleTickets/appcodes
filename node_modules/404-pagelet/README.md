# 404 Pagelet

[![Version npm][version]](http://browsenpm.org/package/404-pagelet)[![Build Status][build]](https://travis-ci.org/bigpipe/404-pagelet)[![Dependencies][david]](https://david-dm.org/bigpipe/404-pagelet)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/404-pagelet?branch=master)

[version]: http://img.shields.io/npm/v/404-pagelet.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/404-pagelet/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/404-pagelet.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/404-pagelet/master.svg?style=flat-square

This Pagelet is responsible for displaying server errors. By
default the 404 Pagelet is provided with [BigPipe]. However, if you
need a custom 404 you can extend this Pagelet. For example to change
the default view.

## Installation

The 404 Pagelet is distributed through the node package manager (npm).

```
npm install --save 404-pagelet
```

## Support

Got stuck? Or can't wrap your head around a concept or just want some feedback,
we got a dedicated IRC channel for that on Freenode:

- **IRC Server**: `irc.freenode.net`
- **IRC Room**: `#bigpipe`

Still stuck? Create an issue. Every question you have is a bug in our
documentation and that should be corrected. So please, don't hesitate to create
issues, many of them.

### Example

In this example the 404 Pagelet is extended with a custom view.
[BigPipe] will automatically discover this extended version
if it is provided to [BigPipe] alongside the other pagelets.

```js
'use strict';

//
// Extend the 404 Pagelet with a custom view.
//
var Fourofour = require('404-pagelet').extend({
  view: '/path/to/my/custom-view.html'
});

//
// Initialise BigPipe server.
//
var pipe = require('bigpipe').createServer(2000, {
  pagelets: [ Fourofour, ... ]
});
```

## Debugging

The library makes use the `diagnostics` module from Pagelet.
To display the 404 Pagelet specific debug messages, supply the
following before running the program or

```bash
DEBUG=pagelet:404 node ...
```

## Testing

Tests are automatically run on [Travis CI] to ensure that everything is
functioning as intended. For local development we automatically install a
[pre-commit] hook that runs the `npm test` command every time you commit changes.
This ensures that we don't push any broken code in to this project.

To run tests locally, make sure the development dependencies are installed.

```bash
npm test
npm run coverage
```

## License

404-pagelet is released under MIT.

[BigPipe]: http://bigpipe.io/
[Travis CI]: http://travisci.org
[Temper]: http://github.com/bigpipe/temper
[pre-commit]: http://github.com/observing/pre-commit