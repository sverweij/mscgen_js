/* eslint no-undefined: 0 */
var assert = require('chai').assert
var map = require('../../utl/maps')

describe('ui/utl/maps', function () {
  describe('#classifyExtension() - ', function () {
    it('empty string should classify as mscgen ', function () {
      assert.strict.equal(map.classifyExtension(''), 'mscgen')
    })

    it('should classify as mscgen ', function () {
      assert.strict.equal(map.classifyExtension('raggerderag.msc'), 'mscgen')
    })

    it('should classify as msgenny ', function () {
      assert.strict.equal(map.classifyExtension('daaris/;d"orgelm.msgenny'), 'msgenny')
    })

    it('string ending with . should classify as mscgen', function () {
      assert.strict.equal(map.classifyExtension('aap.noot/mies.'), 'mscgen')
    })

    it('should classify as ast/json ', function () {
      assert.strict.equal(map.classifyExtension('test01_all_arcs.json'), 'json')
    })

    it('extensionless should classify as mscgen', function () {
      assert.strict.equal(map.classifyExtension('no-extensions-ma'), 'mscgen')
    })
  })

  describe('#correctLanguage() - ', function () {
    it('returns xu in case of mscgen with extensions ', function () {
      assert.strict.equal(map.correctLanguage(true, 'mscgen'), 'xu')
    })

    it('returns mscgen in case of xu witout extensions ', function () {
      assert.strict.equal(map.correctLanguage(false, 'xu'), 'mscgen')
    })

    it('returns msgenny with or without extensions', function () {
      assert.strict.equal(map.correctLanguage(true, 'msgenny'), 'msgenny')
      assert.strict.equal(map.correctLanguage(false, 'msgenny'), 'msgenny')
    })

    it('returns whatever language when  extensions null or undefined', function () {
      assert.strict.equal(map.correctLanguage(undefined, 'mscgen'), 'mscgen')
      assert.strict.equal(map.correctLanguage(null, 'xu'), 'xu')
    })
  })

  describe('#language2Mode() - ', function () {
    it('returns xu when presented with mscgen', function () {
      assert.strict.equal(map.language2Mode('mscgen'), 'text/x-xu')
    })

    it('returns application/json in case of json', function () {
      assert.strict.equal(map.language2Mode('json'), 'application/json')
    })

    it('returns msgenny in case of msgenny', function () {
      assert.strict.equal(map.language2Mode('msgenny'), 'text/x-msgenny')
    })

    it('returns xu in case of xu', function () {
      assert.strict.equal(map.language2Mode('xu'), 'text/x-xu')
    })

    it('returns whatever in case of whatever', function () {
      assert.strict.equal(map.language2Mode('whatever'), 'whatever')
    })

    it('returns text/x-mscgen in case of text/x-mscgen', function () {
      assert.strict.equal(map.language2Mode('text/x-mscgen'), 'text/x-mscgen')
    })
  })

  describe('#sanitizeBooleanesque() - ', function () {
    it('sanitize non booleanesque', function () {
      assert.strict.equal(false, map.sanitizeBooleanesque('this is not a booleanesque'))
    })

    it('sanitize non booleanesque', function () {
      assert.strict.equal(false, map.sanitizeBooleanesque(undefined))
    })

    it('sanitize booleanesque', function () {
      assert.strict.equal(true, map.sanitizeBooleanesque('1'))
    })

    it('sanitize booleanesque', function () {
      assert.strict.equal(false, map.sanitizeBooleanesque('0'))
    })
  })
})
