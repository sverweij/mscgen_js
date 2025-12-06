const sampleListReader = require('../../interpreter/sampleListReader')
const fixture = require('./sampleListReaderFixture.json')
const assert = require('node:assert/strict')
const { describe, it } = require('node:test')
// kutjelikken is

describe('sampleListReader', function () {
  const OPTIONS_NO_DEBUG_FIXTURE = '<optgroup label="first option group"><option value="samples/debug-not-specified.mscgen">debug not specified</option><option value="samples/debug-false-sample.mscgen">debug false</option></optgroup><optgroup label="second option group"><option value="getikt">mesjogge</option><option value="leip">knetter</option></optgroup>'
  const OPTIONS_DEBUG_FIXTURE = '<optgroup label="first option group"><option value="samples/debug-not-specified.mscgen">debug not specified</option><option value="samples/debug-false-sample.mscgen">debug false</option><option value="samples/debug-true-sample.mscgen">debug true</option></optgroup><optgroup label="second option group"><option value="getikt">mesjogge</option><option value="leip">knetter</option></optgroup>'

  it('should return no debug options when debug not specified', function () {
    assert.deepEqual(sampleListReader.toOptionList(fixture), OPTIONS_NO_DEBUG_FIXTURE)
  })
  it('should return no debug options when debug false', function () {
    assert.deepEqual(sampleListReader.toOptionList(fixture, false), OPTIONS_NO_DEBUG_FIXTURE)
  })
  it('should also return debug options when debug true', function () {
    assert.deepEqual(sampleListReader.toOptionList(fixture, true), OPTIONS_DEBUG_FIXTURE)
  })
})
