'use strict';

var Pagelet = require('pagelet');

//
// Default 500 error pagelet that will be served if none is provided.
//
Pagelet.extend({
  name: '500',
  path: '/500',
  statusCode: 500,
  view: '500.html',
  pagelets: {
    diagnostics: require('diagnostics-pagelet')
  },

  /**
   * Extend the default constructor to allow second data parameter.
   *
   * @param {Object} options Optional options.
   * @param {Error} error Error data and stack.
   * @param {String} name Pagelet name that the Error pagelet replaces.
   * @api public
   */
  constructor: function constructor(options, error, name) {
    Pagelet.prototype.constructor.call(this, options);

    if (name) this.name = name;
    this.data = error instanceof Error ? error : {};
  },

  /**
   * Return available data depending on environment settings.
   *
   * @param {Function} render Completion callback.
   * @api private
   */
  get: function get(render) {
    render(null, {
      env: this.env,
      message: this.data.message,
      stack: this.env !== 'production' ? this.data.stack : ''
    });
  }
}).on(module);