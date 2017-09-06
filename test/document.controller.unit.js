var expect = require('chai').expect,
    sinon  = require('sinon'),
    rewire = require('rewire'),
    Document = require('../src/document.model'),
    DocumentController = rewire('../src/document.controller')

describe("DocumentController", ()=>{
  describe("#create", ()=>{
    var subject = DocumentController.create( "sample contents" )
    it( "returns a document object", ()=>{
      expect( subject ).to.be.instanceof( Document );
    })
    it( "assigns content to file in document", ()=>{
      expect( subject.file ).to.equal( "sample contents" );
    })
  })
  describe("#search", () => {
    var Document, searchStub;
    beforeEach(() => {
      Document = DocumentController.__get__('Document')
      searchStub = sinon.stub( Document, 'search' ).callsArg(1)
    })
    it( "call search on document object", ( done ) =>{
      DocumentController.search( "test", ()=>{
        sinon.assert.called( searchStub )
        done()
      })
    })
  })
})
