describe('500 Pagelet', function () {
  'use strict';

  var Pagelet = require('pagelet')
    , Fivehundred = require('../')
    , Route = require('routable')
    , Temper = require('temper')
    , assume = require('assume')
    , pagelet;

  beforeEach(function () {
    pagelet = new Fivehundred;
  });

  afterEach(function each() {
    pagelet = null;
  });

  it('is an extendible constructor', function () {
    assume(Fivehundred.extend).to.be.a('function');
    assume(pagelet).to.be.instanceof(Fivehundred);
    assume(pagelet).to.be.instanceof(Pagelet);
  });

  it('has default values', function () {
    assume(pagelet.name).to.equal('500');
    assume(pagelet.statusCode).to.equal(500);
    assume(pagelet.view).to.equal(process.cwd() + '/500.html');
    assume(pagelet.env).to.equal(process.env.NODE_ENV || 'development');
  });

  it('has diagnostics child pagelet', function (done) {
    assume(pagelet.pagelets).to.be.an('object');
    assume(pagelet.pagelets.diagnostics).to.be.a('function');

    Fivehundred.optimize({ temper: new Temper }, function (error, Pagelet) {
      pagelet = new Pagelet;

      assume(pagelet._children).to.be.an('array');
      assume(pagelet._children.length).to.equal(1);
      done();
    });
  });

  it('has default /500 path', function () {
    assume(Fivehundred.prototype.path).to.be.an('string');
    assume(pagelet.path).to.be.an('string');
    assume(pagelet.path).to.equal('/500');
  });

  it('can have a custom view', function () {
    pagelet = new (Fivehundred.extend({
      view: 'fixtures/view.html'
    }).on(module))({ temper: new Temper });

    assume(pagelet.view).to.equal(process.cwd() + '/test/fixtures/view.html');
  });

  describe('#constructor', function () {
    it('is a function', function () {
      assume(Fivehundred).is.a('function');
      assume(Fivehundred.length).to.equal(3);
    });

    it('can be provided with an optional Error', function () {
      pagelet = new Fivehundred({ temper: new Temper }, new Error('failed test'));

      assume(pagelet.data).to.be.instanceof(Error);
      assume(pagelet.data).to.have.property('message', 'failed test');
      assume(pagelet.data).to.have.property('stack');
      assume(pagelet.data.stack).to.be.an('string');
    });

    it('can be provided with the name of the Pagelet it replaces', function () {
      pagelet = new Fivehundred({ temper: new Temper }, new Error('failed test'), 'search');

      assume(pagelet.name).to.equal('search');
    });
  });

  describe('#get', function () {
    it('is a function', function () {
      assume(pagelet.get).is.a('function');
      assume(pagelet.get.length).to.equal(1);
    });

    it('returns error data for template rendering', function (done) {
      var err = { message: 'I\'m working', stack: 'will be returned' };

      pagelet.data = err;
      pagelet.get(function (error, data) {
        assume(error).to.equal(null);
        assume(data.message).to.equal(err.message);
        assume(data.stack).to.equal(err.stack);
        done();
      });
    });

    it('does not return the full error stack if the enviroment is production', function (done) {
      var err = { message: 'I\'m working', stack: 'will be returned' };

      pagelet.data = err;
      pagelet.env = 'production';
      pagelet.get(function (error, data) {
        assume(error).to.equal(null);
        assume(data.env).to.equal(pagelet.env);
        assume(data.message).to.equal(err.message);
        assume(data.stack).to.not.equal(err.stack);
        done();
      });
    });
  });
});
