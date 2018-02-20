const express = require('express');
const validUrl = require('valid-url');
const {mongoose} = require("./db/mongoose");
const {Url} = require("./models/url");

const port = process.env.PORT || 3000;

const type = "https://quiet-hollows-81269.herokuapp.com/" || "http://localhost:3000/";


var app = express();

app.get('/list', (req, res) => {
    Url.find({}, {__v:0, _id: 0}).then((docs) => {
            res.send({docs});
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/:url', (req, res) =>{
  
    Url.find({shortUrl: type + req.params.url}).then((url) => {
        if(url == ""){
          res.status(400).send("Please configure the url shortener service on the route /new/yourURL");
        } else {
          res.redirect(url[0].longUrl); 
        }
        
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/new/*', (req, res) =>{
        
    var completeUrl = req.params[0];

    Object.keys(req.query).forEach(function(key) {
        completeUrl += "?"+ key + "=" + req.query[key];

    });
    
    
    if (!validUrl.isUri(completeUrl)){
        res.send({error: "Invalid URL"});
    } 
    
    const url = new Url({
        longUrl: completeUrl,
        shortUrl: type + Math.floor(1000 + (9999 - 1000) * Math.random())
    });
    
    url.save()
        .then((doc) => {
            res.send({longUrl: doc.longUrl, shortUrl: doc.shortUrl});
        }, (e) => {
            res.status(400).send(e);
        });
});



app.listen(port,() => {
    console.log("Server is up on port " + port)
});