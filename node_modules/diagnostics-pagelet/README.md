# Diagnostics Pagelet

[![Version npm][version]](http://browsenpm.org/package/diagnostics-pagelet)[![Build Status][build]](https://travis-ci.org/bigpipe/diagnostics-pagelet)[![Dependencies][david]](https://david-dm.org/bigpipe/diagnostics-pagelet)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/diagnostics-pagelet?branch=master)

[version]: http://img.shields.io/npm/v/diagnostics-pagelet.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/diagnostics-pagelet/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/diagnostics-pagelet.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/diagnostics-pagelet/master.svg?style=flat-square

Default diagnostics Pagelet used by the diagnostics and 500 Pagelet.
This Pagelet is responsible for displaying additional diagnostics. By
default the diagnostics Pagelet is provided with [BigPipe]. However, if you
need a custom diagnostics you can extend this Pagelet. For example to change
the default view.

## Installation

The diagnostics Pagelet is distributed through the node package manager (npm).

```
npm install --save diagnostics-pagelet
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

In this example the diagnostics Pagelet is extended with a custom view, which
in turn is provided to a custom 500 Pagelet. [BigPipe] will automatically
discover this extended version of the 500 Pagelet if it is provided to [BigPipe]
alongside the other pagelets.

```js
'use strict';

//
// Extend 500 Pagelet with custom Diagnostics Pagelet.
//
var Fivehundred = require('500-pagelet').extend({
  pagelets: {
    diagnostics: require('diagnostics-pagelet').extend({
      view: '/path/to/my/custom-view.html'
    })
  }
});
```

## Debugging

The library makes use the `diagnostics` module from Pagelet.
To display the diagnostics Pagelet specific debug messages, supply the
following before running the program or

```bash
DEBUG=pagelet:diagnostics node ...
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

diagnostics-pagelet is released under MIT.

[BigPipe]: http://bigpipe.io/
[Travis CI]: http://travisci.org
[Temper]: http://github.com/bigpipe/temper
[pre-commit]: http://github.com/observing/pre-commit