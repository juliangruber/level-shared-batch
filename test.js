'use strict'

var test = require('tap').test
var shared = require('./')
var level = require('memdb')

test('shared batch', function (t) {
  t.plan(3)

  var db = level('db')
  var fork = shared(db.batch())

  db.on('batch', function (ops) {
    t.deepEqual(ops, [
      {
        'key': 'foo',
        'type': 'put',
        'value': null
      }, {
        'key': 'bar',
        'type': 'put',
        'value': null
      }, {
        'key': 'baz',
        'type': 'put',
        'value': null
      }, {
        'key': 'yup',
        'type': 'del'
      }
    ])
  })

  var batchA = fork()
  batchA.put('foo').put('bar').write(function (err) {
    t.error(err)
  })

  var batchB = fork()
  batchB.put('baz').del('yup').write(function (err) {
    t.error(err)
  })
})
