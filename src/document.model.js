var Model = require('./model')

class Document extends Model {
  constructor( object ){
    super();
    this.from( object )
  }
  from( object ){
    Object.assign( this, object );
  }
  asDict(){
    return { file: this.file }
  }
}

module.exports = Document
