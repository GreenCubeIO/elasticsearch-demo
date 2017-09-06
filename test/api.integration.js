const
    sinon      = require('sinon'),
    request    = require("supertest"),
    expect     = require("chai").expect,
    fs         = require("fs"),
    rewire     = require("rewire"),
    server     = rewire('../src/app');


describe("API Server", () => {
  describe("Search endpoint", () => {
    var DocumentController, sandbox;
    beforeEach(()=>{
      sandbox = sinon.sandbox.create();
      DocumentController = server.__get__("DocumentController");
    })
    afterEach(()=>{
      sandbox.restore()
    })
    it( "has a root page", ( done ) => {
      request( server )
        .get("/")
        .expect("Content-Type", /json/, done)
    })

    it( "returns an error when no query specified", ( done ) => {
      request( server )
        .get("/")
        .expect(400, done)
    })

    it( "returns a 500 error when the Controller returns an error", ( done ) => {
      sandbox.stub( DocumentController, "search" ).callsArgWith( 1, "ERROR" )
      request( server )
        .get("/?q=test")
        .expect( 500, done )
    })

    it( "returns OK when a query is specified", ( done ) => {
      sandbox.stub( DocumentController, "search" ).callsArgWith( 1, null, {} )
      request( server )
        .get("/?q=test")
        .expect( 200, done );
    })
  })

  describe("POST /", () => {
    it( "requires a document to be present", ( done ) => {
      request( server )
        .post("/")
        .expect( 400, done )
    })
    describe( "when document received", ( done ) => {
      var createStub;
      beforeEach(()=>{
         var dc = server.__get__( 'DocumentController' )
         createStub = sinon.stub( dc, 'create').callsArg( 2 ) 
      })
      afterEach(()=>{
        createStub.restore()
      })
      it( "gives returns 200" , (done) => {
        request( server )
          .post("/")
          .send( { file: fs.readFileSync("test/fixtures/lorem.pdf.base64") } )
          .expect( 200, done );
      })
      it( "send the file to the DocumentController" , (done) => {
        request( server )
          .post("/")
          .send( { file: fs.readFileSync("test/fixtures/lorem.pdf.base64", "utf8") } )
          .expect( 200, () => {
            sinon.assert.calledOnce( createStub );
            done();
          })
      })
    })
  })
})
