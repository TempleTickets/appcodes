describe('floppy', function () {
  'use strict';

  var assume = require('assume')
    , Floppy = require('./')
    , floppy;

  beforeEach(function () {
    floppy = new Floppy('//google.com/ga.js');
  });

  afterEach(function each() {
    floppy.destroy();
  });

  it('is exposed as function', function () {
    assume(Floppy).is.a('function');
  });

  it('can be created without new keyword', function () {
    assume(Floppy()).is.instanceOf(Floppy);
  });

  it('has default readyState of loading', function () {
    assume(floppy.readyState).equals(Floppy.LOADING);
  });

  describe('#add', function () {
    it('increments the dependent', function () {
      var loaded = false;

      assume(floppy.dependent).equals(0);
      assume(floppy.add(function () { loaded = true; })).is.true();

      assume(floppy.dependent).equals(1);
      assume(loaded).is.false();
    });

    it('executes the supplied directly if we are already loaded', function () {
      var loaded = false;

      assume(floppy.dependent).equals(0);
      floppy.exec();
      assume(floppy.add(function () { loaded = true; })).is.true();

      assume(floppy.dependent).equals(1);
      assume(loaded).is.true();
    });

    it('does not add anything to dead files', function () {
      var loaded = false;

      assume(floppy.dependent).equals(0);
      floppy.destroy();
      assume(floppy.add(function (err) {
        assume(err.message).includes('destroyed');
        loaded = true;
      })).is.false();

      assume(floppy.dependent).equals(0);
      assume(loaded).is.true();
    });
  });

  describe('#destroy', function () {
    it('sets the readyState to dead', function () {
      assume(floppy.destroy()).equals(floppy);
      assume(floppy.readyState).equals(Floppy.DEAD);
    });

    it('calls functions that were added using #unload', function (next) {
      assume(floppy.unload(next)).equals(floppy);
      floppy.destroy();
    });

    it('calls all queued callbacks with an error argument', function (next) {
      floppy.add(function (err) {
        assume(err.message).includes('destroyed');

        next();
      });

      floppy.destroy();
    });
  });

  describe('#exec', function () {
    it('will destroy the instance when called with an error', function () {
      floppy.add(function () {});
      floppy.exec(new Error('lol'));

      assume(floppy.readyState).equals(Floppy.DEAD);
    });

    it('will execute all assigned callbacks in order', function () {
      var order = [];

      floppy.add(function () { order.push(1); });
      floppy.add(function () { order.push(2); });
      floppy.add(function () { order.push(3); });

      assume(floppy.exec()).equals(floppy);
      assume(order.join(',')).equals('1,2,3');
    });

    it('calls the callbacks with the arguments', function (next) {
      floppy.add(function (err, foo, bar) {
        if (err) return next(err);

        assume(foo).equals('foo');
        assume(bar).equals('bar');

        next();
      });

      floppy.exec(undefined, 'foo', 'bar');
    });
  });

  describe('#eject', function () {
    it('will not destroy when there are still dependent', function () {
      var deps = 2;

      floppy.add(function () {});
      floppy.add(function () {});
      assume(floppy.readyState).equals(Floppy.LOADING);

      floppy.exec();
      assume(floppy.readyState).equals(Floppy.LOADED);
      assume(floppy.dependent).equals(2);

      assume(floppy.eject()).is.false();
      assume(floppy.readyState).equals(Floppy.LOADED);
      assume(floppy.dependent).equals(1);

      assume(floppy.eject()).is.true();
      assume(floppy.readyState).equals(Floppy.DEAD);
      assume(floppy.dependent).equals(0);
    });
  });
});
