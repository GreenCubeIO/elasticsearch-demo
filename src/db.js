"use strict"

var es  = require('elasticsearch'),
    url = require('url'),
    path = require('path');

let _instance = [], _defaultInstance = null;

class Database {
  static get defaultInstance(){ return _defaultInstance }
  constructor( uri ){
    if( ! _instance[ uri ] ){
      var parsed_url  = url.parse( uri );
      var parsed_path = path.parse( parsed_url.pathname );
      this.client = es.Client( { host: [ parsed_url.hostname, parsed_url.port ].join(':') } )
      this.index = parsed_path.name

      _instance[ uri ] = this;
    }
    if( ! _defaultInstance ) _defaultInstance = this;
    return _instance[ uri ];
  }
  prepareQuery( obj ){
    return Object.assign( {}, obj, { index: this.index } )
  }
  count( query, callback ){
    this.client
          .count( this.prepareQuery( query ) )
          .then(( res ) => { callback( null, res ); }, ( err ) => { callback( err )} )
  }
  search( obj, callback ){
    this.client
          .search( this.prepareQuery( obj ) )
          .then(( res ) => { callback( null, res ); }, ( err ) => { callback( err )} )
  }
  insert( obj, callback ){
    this.client
          .index( this.prepareQuery( obj ) )
          .then(( res ) => { callback( null, res ); }, ( err ) => { callback( err )} )
  }
}

module.exports = Database;
