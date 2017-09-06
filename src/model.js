var Database = require('./db');

class Model {
  asDict(){ throw(new Error( "Must be overrided" )); }
  static get db(){ return Database.defaultInstance; }
  get db(){ return Database.defaultInstance; }
  static baseQuery( query ){
    return {
      "type": this.name.toLowerCase(),
    }
  }
  static search( query, callback ) {
    this.db.search( this.searchQuery( query ), callback );
  }

  static count( callback ){
    this.db.count( this.baseQuery(), callback );
  }

  save( callback ){
    this.constructor.db.insert( this.createQuery(), callback )
    return this;
  }

  static searchQuery( query ){
    return Object.assign( this.baseQuery(), {
      body: {
        _source: false,
        query: {
          match: { "file.content": query }
        },
        stored_fields: [ "file.content_type", "file.date", "file.author", "file.title" ],
        highlight: {
          fields: { "file.content": {}, "file.name": {} }
        }
      }
    });
  }
  createQuery(){
    return Object.assign( this.constructor.baseQuery(), { body: this.asDict() })
  }
}

module.exports = Model
