/* eslint max-len:0 */
const assert = require('node:assert/strict')
const xport = require('../../utl/exporter')
const { describe, it } = require('node:test')

const gAST = {
  meta: {
    extendedOptions: false,
    extendedArcTypes: false,
    extendedFeatures: false
  },
  entities: [
    {
      name: 'a',
      label: '💩'
    },
    {
      name: 'b',
      label: '序'
    },
    {
      name: 'c',
      label: '💩'
    }
  ],
  arcs: [
    [
      {
        kind: '=>',
        from: 'a',
        to: 'b',
        label: 'things'
      },
      {
        kind: '=>',
        from: 'c',
        to: 'b'
      }
    ]
  ]
}
const gSVG = '<svg>just a dummy thing</svg>'
const gMsc = 'msc{a[label="💩"],b[label="序"],c [label="💩"]; a => b[label="things"], c => b;}'
const gMsGenny = 'a : 💩, b : 序, c : 💩; a => b : things, c => b;'

describe('ui/utl/exporter', function () {
  describe('#toVectorURI', function () {
    it('Should render an URI encoded svg', function () {
      assert.strictEqual(xport.toVectorURI(gSVG),
        'data:image/svg+xml;charset=utf-8,%3C!DOCTYPE%20svg%20%5B%3C!ENTITY%20nbsp%20%22%26%23160%3B%22%3E%5D%3E%3Csvg%3Ejust%20a%20dummy%20thing%3C%2Fsvg%3E')
    })
  })
  describe('#toHTMLSnippetURI', function () {
    it('should render an URI encoded html file with the passed chart embedded', function () {
      assert.strictEqual(xport.toHTMLSnippetURI(gMsc, 'mscgen', {}),
        "data:text/plain;charset=utf-8,%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%3Chead%3E%0A%20%20%20%20%3Cmeta%20content%3D'text%2Fhtml%3Bcharset%3Dutf-8'%20http-equiv%3D'Content-Type'%3E%0A%20%20%20%20%3Cscript%20src%3D'https%3A%2F%2Fsverweij.github.io%2Fmscgen_js%2Fmscgen-inpage.js'%20defer%3E%0A%20%20%20%20%3C%2Fscript%3E%0A%20%20%3C%2Fhead%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Cpre%20class%3D'code%20mscgen%20mscgen_js'%3E%0Amsc%7Ba%5Blabel%3D%22%F0%9F%92%A9%22%5D%2Cb%5Blabel%3D%22%E5%BA%8F%22%5D%2Cc%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%20a%20%3D%3E%20b%5Blabel%3D%22things%22%5D%2C%20c%20%3D%3E%20b%3B%7D%0A%20%20%20%20%3C%2Fpre%3E%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E")
    })
    it('values that are defaults anyway do not end up in the generated HTML', function () {
      assert.strictEqual(
        xport.toHTMLSnippetURI(
          gMsc,
          'mscgen',
          {
            withLinkToEditor: false,
            mirrorEntities: false,
            namedStyle: 'none'
          }
        ),
        "data:text/plain;charset=utf-8,%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%3Chead%3E%0A%20%20%20%20%3Cmeta%20content%3D'text%2Fhtml%3Bcharset%3Dutf-8'%20http-equiv%3D'Content-Type'%3E%0A%20%20%20%20%3Cscript%20src%3D'https%3A%2F%2Fsverweij.github.io%2Fmscgen_js%2Fmscgen-inpage.js'%20defer%3E%0A%20%20%20%20%3C%2Fscript%3E%0A%20%20%3C%2Fhead%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Cpre%20class%3D'code%20mscgen%20mscgen_js'%3E%0Amsc%7Ba%5Blabel%3D%22%F0%9F%92%A9%22%5D%2Cb%5Blabel%3D%22%E5%BA%8F%22%5D%2Cc%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%20a%20%3D%3E%20b%5Blabel%3D%22things%22%5D%2C%20c%20%3D%3E%20b%3B%7D%0A%20%20%20%20%3C%2Fpre%3E%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E")
    })
    it('should render an URI encoded html file with a link to the interpreter', function () {
      assert.strictEqual(
        xport.toHTMLSnippetURI(gMsGenny, 'msgenny', { withLinkToEditor: true }),
        "data:text/plain;charset=utf-8,%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%3Chead%3E%0A%20%20%20%20%3Cmeta%20content%3D'text%2Fhtml%3Bcharset%3Dutf-8'%20http-equiv%3D'Content-Type'%3E%0A%20%20%20%20%3Cscript%3E%0A%20%20%20%20%20%20var%20mscgen_js_config%20%3D%20%7B%0A%20%20%20%20%20%20%20%20clickable%3A%20true%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C%2Fscript%3E%0A%20%20%20%20%3Cscript%20src%3D'https%3A%2F%2Fsverweij.github.io%2Fmscgen_js%2Fmscgen-inpage.js'%20defer%3E%0A%20%20%20%20%3C%2Fscript%3E%0A%20%20%3C%2Fhead%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Cpre%20class%3D'code%20msgenny%20mscgen_js'%20data-language%3D'msgenny'%3E%0Aa%20%3A%20%F0%9F%92%A9%2C%20b%20%3A%20%E5%BA%8F%2C%20c%20%3A%20%F0%9F%92%A9%3B%20a%20%3D%3E%20b%20%3A%20things%2C%20c%20%3D%3E%20b%3B%0A%20%20%20%20%3C%2Fpre%3E%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E")
    })
    it('non-default values for mirrorEntities and namedStyle end up in the HTML', function () {
      assert.strictEqual(
        xport.toHTMLSnippetURI(
          gMsGenny,
          'msgenny',
          {
            withLinkToEditor: false,
            mirrorEntities: true,
            verticalLabelAlignment: 'above',
            namedStyle: 'lazy'
          }
        ),
        "data:text/plain;charset=utf-8,%3C!DOCTYPE%20html%3E%0A%3Chtml%3E%0A%20%20%3Chead%3E%0A%20%20%20%20%3Cmeta%20content%3D'text%2Fhtml%3Bcharset%3Dutf-8'%20http-equiv%3D'Content-Type'%3E%0A%20%20%20%20%3Cscript%20src%3D'https%3A%2F%2Fsverweij.github.io%2Fmscgen_js%2Fmscgen-inpage.js'%20defer%3E%0A%20%20%20%20%3C%2Fscript%3E%0A%20%20%3C%2Fhead%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Cpre%20class%3D'code%20msgenny%20mscgen_js'%20data-language%3D'msgenny'%20data-named-style%3D'lazy'%20data-mirror-entities%3D'true'%20data-regular-arc-text-vertical-alignment%3D'above'%3E%0Aa%20%3A%20%F0%9F%92%A9%2C%20b%20%3A%20%E5%BA%8F%2C%20c%20%3A%20%F0%9F%92%A9%3B%20a%20%3D%3E%20b%20%3A%20things%2C%20c%20%3D%3E%20b%3B%0A%20%20%20%20%3C%2Fpre%3E%0A%20%20%3C%2Fbody%3E%0A%3C%2Fhtml%3E")
    })
  })
  describe('#todotURI', function () {
    it('should render an URI encoded string representing a graphviz dot program', function () {
      assert.strictEqual(xport.todotURI(gAST),
        'data:text/plain;charset=utf-8,%2F*%20Sequence%20chart%20represented%20as%20a%20directed%20graph%0A%20*%20in%20the%20graphviz%20dot%20language%20(http%3A%2F%2Fgraphviz.org%2F)%0A%20*%0A%20*%20Generated%20by%20mscgen_js%20(https%3A%2F%2Fsverweij.github.io%2Fmscgen_js)%0A%20*%2F%0A%0Agraph%20%7B%0A%20%20rankdir%3DLR%0A%20%20splines%3Dtrue%0A%20%20ordering%3Dout%0A%20%20fontname%3D%22Helvetica%22%0A%20%20fontsize%3D%229%22%0A%20%20node%20%5Bstyle%3Dfilled%2C%20fillcolor%3Dwhite%20fontname%3D%22Helvetica%22%2C%20fontsize%3D%229%22%20%5D%0A%20%20edge%20%5Bfontname%3D%22Helvetica%22%2C%20fontsize%3D%229%22%2C%20arrowhead%3Dvee%2C%20arrowtail%3Dvee%2C%20dir%3Dforward%5D%0A%0A%20%20%22a%22%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%0A%20%20%22b%22%20%5Blabel%3D%22%E5%BA%8F%22%5D%3B%0A%20%20%22c%22%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%0A%0A%20%20%22a%22%20--%20%22b%22%20%5Blabel%3D%22(1)%20things%22%2C%20arrowhead%3D%22normal%22%5D%0A%20%20%22c%22%20--%20%22b%22%20%5Blabel%3D%22(2)%22%2C%20arrowhead%3D%22normal%22%5D%0A%7D')
    })
  })
  describe('#toVanillaMscGenURI', function () {
    it('should render an URI encoded vanilla mscgen program', function () {
      assert.strictEqual(xport.toVanillaMscGenURI(gAST),
        'data:text/plain;charset=utf-8,msc%20%7B%0A%20%20a%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%2C%0A%20%20b%20%5Blabel%3D%22%E5%BA%8F%22%5D%2C%0A%20%20c%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%0A%0A%20%20a%20%3D%3E%20b%20%5Blabel%3D%22things%22%5D%2C%0A%20%20c%20%3D%3E%20b%3B%0A%7D')
    })
  })
  describe('#toDoxygenURI', function () {
    it('should render an URI encoded doxygen pastable program', function () {
      assert.strictEqual(xport.toDoxygenURI(gAST),
        'data:text/plain;charset=utf-8,%20*%20%5Cmsc%0A%20*%20%20%20a%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%2C%0A%20*%20%20%20b%20%5Blabel%3D%22%E5%BA%8F%22%5D%2C%0A%20*%20%20%20c%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%0A%20*%20%0A%20*%20%20%20a%20%3D%3E%20b%20%5Blabel%3D%22things%22%5D%2C%0A%20*%20%20%20c%20%3D%3E%20b%3B%0A%20*%20%5Cendmsc')
    })
  })
  describe('#toLocationString', function () {
    it('with extra parameters', function () {
      const lLocation = {
        protocol: 'http',
        host: 'localhost',
        pathname: 'mscgen_js/index.html',
        search: '?debug=false&donottrack=true'
      }
      assert.strictEqual(
        xport.toLocationString(lLocation, gMsc, 'mscgen', 'on', 'none'),
        'mscgen_js/index.html?lang=mscgen&donottrack=true&debug=false&mirrorentities=on&style=none&msc=msc%7Ba%5Blabel%3D%22%F0%9F%92%A9%22%5D%2Cb%5Blabel%3D%22%E5%BA%8F%22%5D%2Cc%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%20a%20%3D%3E%20b%5Blabel%3D%22things%22%5D%2C%20c%20%3D%3E%20b%3B%7D'
      )
    })
    it('without extra parameters', function () {
      const lLocation = {
        protocol: 'http',
        host: 'localhost',
        pathname: 'mscgen_js/index.html'
      }
      assert.strictEqual(
        xport.toLocationString(lLocation, gMsc, 'mscgen'),
        'mscgen_js/index.html?lang=mscgen&msc=msc%7Ba%5Blabel%3D%22%F0%9F%92%A9%22%5D%2Cb%5Blabel%3D%22%E5%BA%8F%22%5D%2Cc%20%5Blabel%3D%22%F0%9F%92%A9%22%5D%3B%20a%20%3D%3E%20b%5Blabel%3D%22things%22%5D%2C%20c%20%3D%3E%20b%3B%7D'
      )
    })
    it('with a source that is too big (> 4k)', function () {
      const lLocation = {
        protocol: 'http',
        host: 'localhost',
        pathname: 'mscgen_js/index.html',
        search: '?debug=false&donottrack=true'
      }
      const l100wString = '# 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890 1234567890'
      let lBig = l100wString
      for (let i = 0; i < 40; i++) {
        lBig += l100wString
      }
      assert.strictEqual(xport.toLocationString(lLocation, lBig, 'mscgen'),
        'mscgen_js/index.html?lang=mscgen&donottrack=true&debug=false&msc=%23%20source%20too%20long%20for%20an%20URL')
    })
  })
})
