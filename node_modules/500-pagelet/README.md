# 500 Pagelet

[![Version npm][version]](http://browsenpm.org/package/500-pagelet)[![Build Status][build]](https://travis-ci.org/bigpipe/500-pagelet)[![Dependencies][david]](https://david-dm.org/bigpipe/500-pagelet)[![Coverage Status][cover]](https://coveralls.io/r/bigpipe/500-pagelet?branch=master)

[version]: http://img.shields.io/npm/v/500-pagelet.svg?style=flat-square
[build]: http://img.shields.io/travis/bigpipe/500-pagelet/master.svg?style=flat-square
[david]: https://img.shields.io/david/bigpipe/500-pagelet.svg?style=flat-square
[cover]: http://img.shields.io/coveralls/bigpipe/500-pagelet/master.svg?style=flat-square

This Pagelet is responsible for displaying server errors. By
default the 500 Pagelet is provided with [BigPipe]. However, if you
need a custom 500 you can extend this Pagelet. For example to change
the default view.

## Installation

The 500 Pagelet is distributed through the node package manager (npm).

```
npm install --save 500-pagelet
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

In this example the 500 Pagelet is extended with a custom view.
[BigPipe] will automatically discover this extended version
if it is provided to [BigPipe] alongside the other pagelets.
Note that the enviroment variable can be overruled to manage the
data that is displayed.

```js
'use strict';

//
// Extend the 500 Pagelet with a custom view.
//
var Fivehundred = require('500-pagelet').extend({
  view: '/path/to/my/custom-view.html',  // your custom layout
  env: 'development'                     // defaults to process.env.NODE_ENV
});

//
// Initialise BigPipe server.
//
var pipe = require('bigpipe').createServer(2000, {
  pagelets: [ Fivehundred, ... ]
});
```

### API

The following methods are available on the 500 Pagelet instance. Most are
only used internally. There is rarely a reason to call these methods.

#### new Fivehundred()

**public**, _returns Pagelet_.

The 500 constructor expects several options to be provided, these
include: `req`, `res` and `pipe`. The last option is a reference
to the [BigPipe] instance, mainly to ensure the same [Temper]
instance is re-used. All code examples assume your file is setup as:

```js
'use strict';

var Fivehundred = require('500-pagelet');
  , fivehundred = new Fivehundred({ options }, new Error('failure'));
```

#### Bootstrap.get()

**private**, _returns Pagelet_.

Extracts the data from the provided Error to render the template.
If the environment is _production_ the `Error.stack` will not be
provided to the template.

```js
fivehundred.get(function render(error, data) {
  // provide data to pagelet.render
});
```

## Debugging

The library makes use the `diagnostics` module from Pagelet.
To display the 500 Pagelet specific debug messages, supply the
following before running the program or

```bash
DEBUG=pagelet:500 node ...
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

500-pagelet is released under MIT.

[BigPipe]: http://bigpipe.io/
[Travis CI]: http://travisci.org
[Temper]: http://github.com/bigpipe/temper
[pre-commit]: http://github.com/observing/pre-commit