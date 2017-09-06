var Document = require('./document.model'),
    Database = require('./db');

class DocumentController {
  static create( contents, options, callback ){
    return new Document({ file: contents }).save( callback );
  }
  static search( query, callback ){
    Document.search( query, callback );
  }
  static count( callback ){
    Document.count( callback );
  }
}

module.exports = DocumentController
