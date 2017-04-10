'use strict';

/**
 * Representation of one single file that will be loaded.
 *
 * @constructor
 * @param {String} url The file URL.
 * @param {Function} fn Optional callback.
 * @api private
 */
function Floppy(url, fn) {
  if (!(this instanceof Floppy)) return new Floppy(url, fn);

  this.readyState = Floppy.LOADING;
  this.start = +new Date();
  this.callbacks = [];
  this.dependent = 0;
  this.cleanup = [];
  this.url = url;

  if ('function' === typeof fn) {
    this.add(fn);
  }
}

//
// The different readyStates for our Floppy class.
//
Floppy.DEAD     = -1;
Floppy.LOADING  = 0;
Floppy.LOADED   = 1;

/**
 * Added cleanup hook.
 *
 * @param {Function} fn Clean up callback
 * @returns {Floppy}
 * @api public
 */
Floppy.prototype.unload = function unload(fn) {
  this.cleanup.push(fn);
  return this;
};

/**
 * Add a new dependent.
 *
 * @param {Function} fn Completion callback.
 * @returns {Boolean} Callback successfully added or queued.
 * @api private
 */
Floppy.prototype.add = function add(fn) {
  if (Floppy.LOADING === this.readyState) {
    this.callbacks.push(fn);
  } else if (Floppy.LOADED === this.readyState) {
    fn();
  } else {
    fn(new Error('Floppy has been destroyed.'));
    return false;
  }

  this.dependent++;
  return true;
};

/**
 * Remove a dependent. If all dependent's are ejected we will automatically
 * destroy the loaded file from the environment.
 *
 * @returns {Boolean}
 * @api public
 */
Floppy.prototype.eject = function eject() {
  if (0 === --this.dependent) {
    this.destroy();
    return true;
  }

  return false;
};

/**
 * Execute the callbacks.
 *
 * @param {Error} err Optional error.
 * @returns {Floppy}
 * @api public
 */
Floppy.prototype.exec = function exec(err) {
  this.readyState = Floppy.LOADED;

  if (!this.callbacks.length) return this;

  for (var i = 0; i < this.callbacks.length; i++) {
    this.callbacks[i].apply(this.callbacks[i], arguments);
  }

  this.callbacks.length = 0;
  if (err) this.destroy();

  return this;
};

/**
 * Destroy the file.
 *
 * @returns {Floppy}
 * @api public
 */
Floppy.prototype.destroy = function destroy() {
  this.exec(new Error('Resource has been destroyed before it was loaded'));

  if (this.cleanup.length) for (var i = 0; i < this.cleanup.length; i++) {
    this.cleanup[i]();
  }

  this.readyState = Floppy.DEAD;
  this.cleanup.length = this.dependent = 0;

  return this;
};

//
// Expose the instance.
//
module.exports = Floppy;
