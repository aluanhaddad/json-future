'use strict'

var util = require('./util')
var Args = require('args-js')
var sliced = require('sliced')
var nodeify = require('nodeify')
var promise = require('cb2promise')

var DEFAULTS_OPTS = {
  SAVE: {
    indent: '  '
  },
  STRINGIFY: {
    SPACE: 2
  }
}

function getStringifyParams (params) {
  return Args([
    { data: Args.OBJECT | Args.Required },
    { replacer: Args.FUNCTION | Args.Optional },
    { space: Args.NUMBER | Args.Optional, _default: DEFAULTS_OPTS.STRINGIFY.SPACE }
  ], params)
}

function _checkString (data) {
  return data instanceof Buffer ? data.toString() : data
}

function stringifyAsync () {
  var args = sliced(arguments)
  var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null

  var params = getStringifyParams(args)
  var data = params.data
  var replacer = params.replacer
  var space = params.space

  if (!cb) return promise(util.stringifyAsync, data, replacer, space)
  return util.stringifyAsync(data, replacer, space, cb)
}

function stringify () {
  var params = getStringifyParams(arguments)
  var data = params.data
  var replacer = params.replacer
  var space = params.space

  return util.stringify(data, replacer, space)
}

function parseAsync () {
  var args = sliced(arguments)
  var cb = typeof args[args.length - 1] === 'function' ? args.pop() : null

  var params = Args([
    { data: Args.STRING | Args.Required, _check: _checkString },
    { reviver: Args.FUNCTION | Args.Optional },
    { filename: Args.STRING | Args.Optional }
  ], args)

  var data = params.data
  var reviver = params.reviver
  var filename = params.filename

  if (!cb) return promise(util.parseAsync, data, reviver, filename)
  return util.parseAsync(data, reviver, filename, cb)
}

function loadAsync () {
  var params = Args([
    { filepath: Args.STRING | Args.Required },
    { cb: Args.FUNCTION | Args.Optional }
  ], arguments)

  var filepath = params.filepath
  var cb = params.cb

  if (cb) return nodeify(util.loadAsync(filepath), cb)
  return util.loadAsync(filepath)
}

function load () {
  var params = Args([
    { filepath: Args.STRING | Args.Required }
  ], arguments)

  var filepath = params.filepath

  return util.load(filepath)
}

function saveAsync () {
  var params = Args([
    { filepath: Args.STRING | Args.Required },
    { data: Args.OBJECT | Args.Required },
    { opts: Args.OBJECT | Args.Optional, _default: DEFAULTS_OPTS.SAVE },
    { cb: Args.FUNCTION | Args.Optional }
  ], arguments)

  var filepath = params.filepath
  var data = params.data
  var opts = params.opts
  var cb = params.cb

  if (cb) return nodeify(util.saveAsync(filepath, data, opts), cb)
  return util.saveAsync(filepath)
}

function save () {
  var params = Args([
    { filepath: Args.STRING | Args.Required },
    { data: Args.OBJECT | Args.Required },
    { opts: Args.OBJECT | Args.Optional, _default: DEFAULTS_OPTS.SAVE }
  ], arguments)

  var filepath = params.filepath
  var data = params.data
  var opts = params.opts

  return util.save(filepath, data, opts)
}

module.exports = {
  stringifyAsync: stringifyAsync,
  stringify: stringify,
  parseAsync: parseAsync,
  parse: util.parse,
  loadAsync: loadAsync,
  load: load,
  saveAsync: saveAsync,
  save: save
}
