'use strict';

//
// Third party modules.
//
var canihaz = require('canihaz')('smithy');

/**
 * Process React JSX files. The processor has no required options.
 *
 * @param {String} content the raw file content that needs to be processed
 * @param {Object} options supply optional options
 * @param {Function} done callback
 * @api public
 */
var coffee = module.exports = function coffeescript(content, options, done) {
  if ('function' === typeof options) {
    done = options;
    options = Object.create(null);
  }

  canihaz['react-tools'](function requiredReactTools(err, jsx) {
    if (err) return done(err);

    try { return done(null, jsx.transform(content, options)); }
    catch (e) { done(e); }
  });
};

//
// Set of possible extensions this pre-processor can generate.
//
coffee.extensions = [ 'js' ];

//
// Default configuration on export extension.
//
coffee.export = 'js';