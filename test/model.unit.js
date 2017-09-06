var expect = require('chai').expect,
    sinon  = require('sinon'),
    Model = require("../src/model.js");

describe("Model", () => {
  it( "has an internal instance of the db", () => {
    var model = new Model(); 
    expect( model.db ).to.not.be.undefined;
  })
  describe("#asDict", () => {
    var model = new Model(); 
    it("must be overrided", ()=>{
      expect( model.asDict ).to.throw()
    })
  })
  describe("when inherited", () => {
    class Test extends Model{
      asDict(){
        return { property: "test" }
      }
    }
    var subject
    beforeEach(() => { subject = new Test();  })

    describe("#createQuery", () => {
      it( "returns a hash", () => {
        expect(subject.createQuery()).to.be.an('Object')
      })
      it( "contains an index name reflecting current index name", ()=>{
        expect(subject.createQuery()).to.include({ "type": "test"})
      })
      it( "contains a body property", () => {
        expect(subject.createQuery()).to.have.property("body")
      })
      it( "sets body property with an object representation", () => {
        expect(subject.createQuery()["body"]).to.eql( subject.asDict() ) 
      })
    })
    describe( "#searchQuery", () => {
      it( "returns a hash", () => {
        expect(Test.searchQuery()).to.be.an('Object')
      })
      it( "returns the right type and index", () => {
        expect(Test.searchQuery()).to.include({ type: "test" })
      })
      it( "includes the query as q", () => {
        expect( Test.searchQuery( { test: 1 } )  ).to.include.property( "q" );
      })
    })
    describe( "#count", () => {})
    describe( "#search", () => {
      var sandbox, db_search;
      beforeEach(()=>{
        sandbox   = sinon.sandbox.create();
        db_search = sandbox.stub( subject.db, "search" ).callsArgWith( 1, [] )
      })
      afterEach(() => { sandbox.restore() })

      it("asks the database for the documents", () => {
        Test.search( { q: "test" }, ()=>{
          sinon.assert.calledWith( db_search, sinon.match.object )
        })
      })
    })
    describe( "#save", () => {
      var sandbox, db_insert;
      beforeEach(()=>{
        sandbox   = sinon.sandbox.create();
        db_insert = sandbox.stub( subject.db, "insert" ).callsArg( 1 )
      })
      afterEach(() => { sandbox.restore() })
      it( "calls insert in the database", ( done ) => {
        subject.save( () => {
          sinon.assert.calledWith( db_insert, sinon.match.object )
          done()
        })
      })
      it( "calls create query", ( done ) => {
        create_query = sandbox.stub( subject, "createQuery" ).returns( {} )
        subject.save(() => {
          sinon.assert.called( create_query );
          done()
        })
      })
    })
  })
})
