var expect = require("chai").expect,
    sinon  = require("sinon"),
    Db     = require("../src/db");

describe( "db", () => {
  var sandbox, db;
  beforeEach(()=>{
    db      = new Db( "es://localhost:9200/test" )
    sandbox = sinon.sandbox.create()
  })
  afterEach(()=>{ sandbox.restore() })

  it("sets the client", ()=>{
    expect( db.client ).to.not.be.undefined
  })
  it( "sets the index from url", () => {
    expect( db.index ).to.equal( "test" )
  })

  it("can do a query to the database", ( done ) => {
    var stub = sandbox.stub( db.client, "search" ).resolves([])

    db.search( { q: "test" }, () => {
      sinon.assert.called( stub );
      done();
    } )
  });

  it("can do insert an element to de database", ( done ) => {
    var stub = sandbox.stub( db.client, "create" ).resolves([])

    db.insert( { q: "test" }, () => {
      sinon.assert.called( stub );
      done();
    } )
  })
  it("returns a single instance", ()=>{
    var db1 = new Db( "es://localhost:9200/" ), db2 = new Db( "es://localhost:9200/")
    expect( db1 ).to.not.be.undefined;
    expect( db1 ).to.equal( db2 )
  })
  describe("#search", ()=>{
    it( "adds the index to the query", (done) => {
      var stub = sandbox.stub( db.client, "search" ).resolves({})
      db.search({ q: "test" }, () => {
        expect( stub.getCall(0).args[0] ).to.include( { index: "test" } );
        done();
      })
    })
  })
  describe("#create", ()=>{
    it( "adds the index to the query", (done) => {
      var stub = sandbox.stub( db.client, "create" ).resolves({})
      db.insert({ body: { param: "test" } }, () => {
        expect( stub.getCall(0).args[0] ).to.include( { index: "test" } );
        done();
      })
    })
  })
})
