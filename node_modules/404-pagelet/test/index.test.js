describe('404 Pagelet', function () {
  'use strict';

  var Pagelet = require('pagelet')
    , Fourofour = require('../')
    , Route = require('routable')
    , Temper = require('temper')
    , assume = require('assume')
    , pagelet;

  beforeEach(function () {
    pagelet = new Fourofour;
  });

  afterEach(function each() {
    pagelet = null;
  });

  it('is an extendible constructor', function () {
    assume(Fourofour.extend).to.be.a('function');
    assume(pagelet).to.be.instanceof(Fourofour);
    assume(pagelet).to.be.instanceof(Pagelet);
  });

  it('has default values', function () {
    assume(pagelet.name).to.equal('404');
    assume(pagelet.statusCode).to.equal(404);
    assume(pagelet.view).to.equal(process.cwd() + '/404.html');
  });

  it('has diagnostics child pagelet', function (done) {
    assume(pagelet.pagelets).to.be.an('object');
    assume(pagelet.pagelets.diagnostics).to.be.a('function');

    Fourofour.optimize({ temper: new Temper }, function (error, Pagelet) {
      pagelet = new Pagelet;

      assume(pagelet._children).to.be.an('array');
      assume(pagelet._children.length).to.equal(1);
      done();
    });
  });

  it('has default /404 path', function () {
    assume(Fourofour.prototype.path).to.be.an('string');
    assume(pagelet.path).to.be.an('string');
    assume(pagelet.path).to.equal('/404');
  });

  it('can have a custom view', function () {
    pagelet = new (Fourofour.extend({
      view: 'fixtures/view.html'
    }).on(module))({ temper: new Temper });

    assume(pagelet.view).to.equal(process.cwd() + '/test/fixtures/view.html');
  });
});
