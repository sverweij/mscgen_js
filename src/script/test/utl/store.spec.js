/* global localStorage, global */
const store = require('../../utl/store')
const assert = require('node:assert/strict')
const { describe, it, before, after, beforeEach } = require('node:test')

describe('ui/utl/store', function () {
  let lLanguage = 'initial language'
  let lSource = 'initial source'
  let lAutoRender = false
  let lMirrorEntities = false
  let lNamedStyle = null
  let lAlignment = 'middle'
  let lIncludeSource = true

  const lState = {
    getLanguage: function () { return 'other language' },
    setLanguage: function (pLanguage) { lLanguage = pLanguage },
    getSource: function () { return 'other source' },
    setSource: function (pSource) { lSource = pSource },
    getAutoRender: function () { return true },
    setAutoRender: function (pAutoRender) { lAutoRender = pAutoRender },
    getMirrorEntities: function () { return true },
    setMirrorEntities: function (pMirrorEntities) { lMirrorEntities = pMirrorEntities },
    getNamedStyle: function () { return lNamedStyle },
    setNamedStyle: function (pNamedStyle) { lNamedStyle = pNamedStyle },
    getVerticalLabelAlignment: function () { return lAlignment },
    setVerticalLabelAlignment: function (pAlignment) { lAlignment = pAlignment },
    getIncludeSource: function () { return lIncludeSource },
    setIncludeSource: function (pIncludeSource) { lIncludeSource = pIncludeSource }

  }

  describe('#load and save with no localStorage available', function () {
    it('silently fail on load', function () {
      store.load(lState)
      assert.strictEqual(lLanguage, 'initial language')
      assert.strictEqual(lSource, 'initial source')
      assert.strictEqual(lAutoRender, false)
      assert.strictEqual(lMirrorEntities, false)
    })

    it('silently fail on save', function () {
      store.save(lState)
      store.load(lState)
      assert.strictEqual(lLanguage, 'initial language')
      assert.strictEqual(lSource, 'initial source')
      assert.strictEqual(lAutoRender, false)
      assert.strictEqual(lMirrorEntities, false)
    })
    it('#saveSettings silently fail on save', function () {
      store.saveSettings(lState)
      store.load(lState)
      assert.strictEqual(lLanguage, 'initial language')
      assert.strictEqual(lSource, 'initial source')
      assert.strictEqual(lAutoRender, false)
      assert.strictEqual(lMirrorEntities, false)
    })
  })

  describe('#load and save', function () {
    before(function () {
      const nodeLocalStorage = require('node-localstorage')
      global.localStorage = new nodeLocalStorage.LocalStorage(
        './throwmeaway'
      )
      localStorage.clear()
    })

    after(function () {
      localStorage._deleteLocation()
    })

    beforeEach(function () {
      lLanguage = 'initial language'
      lSource = 'initial source'
      lAutoRender = false
      lMirrorEntities = false
      lNamedStyle = null
    })

    it('leaves the state as is when localStorage has no item', function () {
      store.load(lState)
      assert.strictEqual(lLanguage, 'initial language')
      assert.strictEqual(lSource, 'initial source')
      assert.strictEqual(lAutoRender, false)
      assert.strictEqual(lMirrorEntities, false)
    })

    it('saves the passed state', function () {
      store.save(lState)
      store.load(lState)
      assert.strictEqual(lLanguage, 'other language')
      assert.strictEqual(lSource, 'other source')
      assert.strictEqual(lAutoRender, true)
      assert.strictEqual(lMirrorEntities, true)
    })

    it('keeps the source of the state object when saving settings only, but re-retrieving everything', function () {
      store.saveSettings(lState)
      store.load(lState)
      assert.strictEqual(lLanguage, 'other language')
      assert.strictEqual(lSource, 'other source')
      assert.strictEqual(lAutoRender, true)
      assert.strictEqual(lMirrorEntities, true)
    })

    it("doesn't save/ overwrite source when saving & loading settings only", function () {
      store.saveSettings(lState)
      store.loadSettings(lState)
      assert.strictEqual(lLanguage, 'initial language')
      assert.strictEqual(lSource, 'initial source')
      assert.strictEqual(lAutoRender, true)
      assert.strictEqual(lMirrorEntities, true)
    })
  })
})
