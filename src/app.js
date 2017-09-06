var express = require('express'),
    app     = express(),
    bodyParser = require("body-parser"),

    Database = require( './db' ),
    db       = new Database( process.env["CONNECTION_STRING"] ),
    DocumentController = require( './document.controller');

app.use( bodyParser.json( { limit: '10mb' }) )

app.get("/", ( req, res )=>{
  var query = req.query.q;

  if( query ){
    DocumentController.search( query, ( err, result ) => {
      if( err ){
        res.status( 500 ).json( {error: err} )
      } else {
        var hits = result.hits.hits || [];
        res.json( hits.map( (h) => ({
          _id: h._id,
          author: h.fields['file.author'],
          title: h.fields['file.title'],
          date: h.fields['file.date'],
          content_type: h.fields['file.content_type'],
          highlight: h.highlight['file.content']
        }) ))
      }
    })
  } else {
    res.status( 400 ).json( { error: "No query specified" } )
  }
})

app.post("/", ( req, res )=>{
  if( req.body.file ){
    DocumentController.create(
      req.body.file,
      {},
      ( err, response )=>{
        if( err ){
          res.status( 500 ).json( {error: err} )
        } else {
          res.send({ ok: 1})
        }
      }
    )
  } else {
    res
      .status( 400 )
      .send( { error: "Missing file" })
  }
})

module.exports = app
