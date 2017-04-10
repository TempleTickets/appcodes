describe('Diagnostics Pagelet', function () {
  'use strict';

  var Pagelet = require('pagelet')
    , Diagnostics = require('../')
    , Route = require('routable')
    , Temper = require('temper')
    , assume = require('assume')
    , pagelet;

  beforeEach(function () {
    pagelet = new Diagnostics;
  });

  afterEach(function each() {
    pagelet = null;
  });

  it('is an extendible constructor', function () {
    assume(Diagnostics.extend).to.be.a('function');
    assume(pagelet).to.be.instanceof(Diagnostics);
    assume(pagelet).to.be.instanceof(Pagelet);
  });

  it('has default values', function () {
    assume(pagelet.name).to.equal('diagnostics');
    assume(pagelet.css).to.equal('diagnostic.styl');
    assume(pagelet.view).to.equal(process.cwd() + '/diagnostic.html');
  });

  it('can have a custom view', function () {
    pagelet = new (Diagnostics.extend({
      view: 'fixtures/view.html'
    }).on(module))({ temper: new Temper });

    assume(pagelet.view).to.equal(process.cwd() + '/test/fixtures/view.html');
  });
});
