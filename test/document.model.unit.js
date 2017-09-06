var expect     = require("chai").expect,
    Document   = require("../src/document.model.js");

describe("Document Model", ()=>{
  describe("#asDict", ()=>{
    var subject, sample = { title: "test title", plain: "sample content" };
    beforeEach(()=>{
      subject = new Document( sample )
    })
    it("overrides asDict", ()=>{
      expect( subject.asDict.bind( subject ) ).to.not.throw();
    })
    it("returns an object", ()=>{
      expect( subject.asDict() ).to.be.an('Object')
    })
    it("returns object with title and plain", ()=>{
      expect( subject.asDict() ).to.include( { title: sample.title } )
      expect( subject.asDict() ).to.include( { plain: sample.plain } )
    })
    it("reads properties from dictionary", () => {
      expect( subject.title ).to.equal( sample.title );
      expect( subject.plain ).to.equal( sample.plain );
    })
  })
})


