/* eslint max-len:0 */
const sampleListReader = require('../../interpreter/sampleListReader')
const fixture = require('./sampleListReaderFixture.json')
const expect = require('chai').expect

describe('sampleListReader', function () {
  const OPTIONS_NO_DEBUG_FIXTURE = '<optgroup label="first option group"><option value="samples/debug-not-specified.mscgen">debug not specified</option><option value="samples/debug-false-sample.mscgen">debug false</option></optgroup><optgroup label="second option group"><option value="getikt">mesjogge</option><option value="leip">knetter</option></optgroup>'
  const OPTIONS_DEBUG_FIXTURE = '<optgroup label="first option group"><option value="samples/debug-not-specified.mscgen">debug not specified</option><option value="samples/debug-false-sample.mscgen">debug false</option><option value="samples/debug-true-sample.mscgen">debug true</option></optgroup><optgroup label="second option group"><option value="getikt">mesjogge</option><option value="leip">knetter</option></optgroup>'

  it('should return no debug options when debug not specified', function () {
    expect(sampleListReader.toOptionList(fixture)).to.equal(OPTIONS_NO_DEBUG_FIXTURE)
  })
  it('should return no debug options when debug false', function () {
    expect(sampleListReader.toOptionList(fixture, false)).to.equal(OPTIONS_NO_DEBUG_FIXTURE)
  })
  it('should also return debug options when debug true', function () {
    expect(sampleListReader.toOptionList(fixture, true)).to.equal(OPTIONS_DEBUG_FIXTURE)
  })
})
