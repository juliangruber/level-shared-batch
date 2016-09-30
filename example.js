'use strict'

var shared = require('./')
var level = require('memdb')

var db = level('db')

var fork = shared(db.batch())

var batchA = fork()
batchA.put('foo').put('bar').write(function () {
  console.log('batch a written')
})

var batchB = fork()
batchB.put('baz').del('yup').write(function () {
  console.log('batch b written')
})

console.log('forked')
