'use strict'

var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var AbstractChainedBatch = require('abstract-leveldown').AbstractChainedBatch
var inherits = require('util').inherits

module.exports = function shared (batch) {
  var forks = []
  var todo = 0
  var abstract = new AbstractLevelDOWN('')

  return function fork () {
    var forkedBatch = new ForwardingBatch(abstract, batch, function () {
      process.nextTick(commit)
    })

    todo++
    forks.push(forkedBatch)
    return forkedBatch
  }

  function commit () {
    if (--todo) return
    batch.write(function (err) {
      forks.forEach(function (forkedBatch) {
        forkedBatch.cb(err)
      })
    })
  }
}

function ForwardingBatch (db, batch, onwrite) {
  AbstractChainedBatch.call(this)
  this._db = db
  this._batch = batch
  this._onwrite = onwrite
  this.cb = null
}

inherits(ForwardingBatch, AbstractChainedBatch)

ForwardingBatch.prototype._put = function (key, value) {
  this._batch.put(key, value)
}

ForwardingBatch.prototype._del = function (key) {
  this._batch.del(key)
}

ForwardingBatch.prototype._clear = function () {
  this._batch.clear()
}

ForwardingBatch.prototype._write = function (cb) {
  this.cb = cb
  this._onwrite()
}
