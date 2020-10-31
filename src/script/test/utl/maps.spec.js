const assert = require('chai').assert
const map = require('../../utl/maps')

describe('ui/utl/maps', function () {
  describe('#classifyExtension() - ', function () {
    it('empty string should classify as mscgen ', function () {
      assert.strictEqual(map.classifyExtension(''), 'mscgen')
    })

    it('should classify as mscgen ', function () {
      assert.strictEqual(map.classifyExtension('raggerderag.msc'), 'mscgen')
    })

    it('should classify as msgenny ', function () {
      assert.strictEqual(map.classifyExtension('daaris/;d"orgelm.msgenny'), 'msgenny')
    })

    it('string ending with . should classify as mscgen', function () {
      assert.strictEqual(map.classifyExtension('aap.noot/mies.'), 'mscgen')
    })

    it('should classify as ast/json ', function () {
      assert.strictEqual(map.classifyExtension('test01_all_arcs.json'), 'json')
    })

    it('extensionless should classify as mscgen', function () {
      assert.strictEqual(map.classifyExtension('no-extensions-ma'), 'mscgen')
    })
  })

  describe('#correctLanguage() - ', function () {
    it('returns xu in case of mscgen with extensions ', function () {
      assert.strictEqual(map.correctLanguage(true, 'mscgen'), 'xu')
    })

    it('returns mscgen in case of xu witout extensions ', function () {
      assert.strictEqual(map.correctLanguage(false, 'xu'), 'mscgen')
    })

    it('returns msgenny with or without extensions', function () {
      assert.strictEqual(map.correctLanguage(true, 'msgenny'), 'msgenny')
      assert.strictEqual(map.correctLanguage(false, 'msgenny'), 'msgenny')
    })

    it('returns whatever language when  extensions null or undefined', function () {
      assert.strictEqual(map.correctLanguage(undefined, 'mscgen'), 'mscgen')
      assert.strictEqual(map.correctLanguage(null, 'xu'), 'xu')
    })
  })

  describe('#language2Mode() - ', function () {
    it('returns xu when presented with mscgen', function () {
      assert.strictEqual(map.language2Mode('mscgen'), 'text/x-xu')
    })

    it('returns application/json in case of json', function () {
      assert.strictEqual(map.language2Mode('json'), 'application/json')
    })

    it('returns msgenny in case of msgenny', function () {
      assert.strictEqual(map.language2Mode('msgenny'), 'text/x-msgenny')
    })

    it('returns xu in case of xu', function () {
      assert.strictEqual(map.language2Mode('xu'), 'text/x-xu')
    })

    it('returns whatever in case of whatever', function () {
      assert.strictEqual(map.language2Mode('whatever'), 'whatever')
    })

    it('returns text/x-mscgen in case of text/x-mscgen', function () {
      assert.strictEqual(map.language2Mode('text/x-mscgen'), 'text/x-mscgen')
    })
  })

  describe('#sanitizeBooleanesque() - ', function () {
    it('sanitize non booleanesque', function () {
      assert.strictEqual(false, map.sanitizeBooleanesque('this is not a booleanesque'))
    })

    it('sanitize non booleanesque', function () {
      assert.strictEqual(false, map.sanitizeBooleanesque(undefined))
    })

    it('sanitize booleanesque', function () {
      assert.strictEqual(true, map.sanitizeBooleanesque('1'))
    })

    it('sanitize booleanesque', function () {
      assert.strictEqual(false, map.sanitizeBooleanesque('0'))
    })
  })
})
