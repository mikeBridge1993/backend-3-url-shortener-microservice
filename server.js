const express = require('express');
const validUrl = require('valid-url');
const {mongoose} = require("./db/mongoose");
const {Url} = require("./models/url");

const port = process.env.PORT || 3000;

const type = "http://localhost:3000/" || heroku;

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
 
    if (!validUrl.isUri(req.params[0])){
        res.send({error: "Invalid URL"});
    } 
    
    const url = new Url({
        longUrl: req.params[0],
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