// In order for the app to do what I wanted I had to set up an express server

var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var fs = require('fs');
var cookieSession = require('cookie-session')
var listTorrents = require('./listTorrents');

app.set('port', process.env.PORT || 3000)

app.use(express.static('public'))

//middleware used to save put.io keys in a cookie
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//using put.io api to add files
app.get('/add_to_put', function(req, res) {
      
      if(req.session.token !== undefined){
      
      var torrent_options = {
        uri: req.query.q,
        method: 'GET'
      }
      request(torrent_options, function(error, response, body) {
        if (!error) {
          fs = require('fs')
          var oauth_key = req.session.token;
          var put_options = {
            url: 'https://upload.put.io/v2/files/upload?oauth_token=' + oauth_key,
            method: 'POST',
          }
          console.log(put_options)
          var r = request(put_options, function(error, response, body) {
              console.log(body)
            if (!error) {
                var event_options = {url: 'https://api.put.io/v2/events/list?oauth_token=' + oauth_key, method: 'GET'}
                var title = JSON.parse(body).transfer.name;
                var transferLink = JSON.parse(body).transfer.torrent_link
                console.log(title);
                request(event_options, function(error, response, body) {
                    if (!error) {
                        console.log(body)
                        var parsed_event = JSON.parse(body).events[0];
                        console.log(parsed_event.transfer_name)
                            res.redirect('http://put.io/transfers')
                    } else {
                        res.send(error)
                    }
                });
            } else {
              res.send(error + "error")
            }
           });
           var form = r.form();
           form.append('file', fs.createReadStream("temp_torrent.torrent"));
        } else {
          res.send (error + "error")
        }
}).pipe(fs.createWriteStream('temp_torrent.torrent'));
      
      } else {
        window.alert("Please log in first");
      }


});

//put.io api for authentication
app.get('/put_oauth', function(req, res) {
  var redirectUri = "http://autotorrent.herokuapp.com";
  if(process.env.DEVELOPMENT){
    redirectUri = "http://localhost:3000";
  }
    var put_options = {
         uri: "https://api.put.io/v2/oauth2/access_token?client_id=2332&client_secret=mr5bvnvcql9c5h0iv774&grant_type=authorization_code&redirect_uri=" + redirectUri + "/put_oauth&code=" + encodeURIComponent(req.query.code),
         method: "GET",
    };
    var parsed_body = null;
  
    request(put_options, function (error, response, body) {
        if (!error) {
            console.log(body)
            req.session.token = JSON.parse(body).access_token;
            res.redirect('/');
        } else {
            res.send(error + "TEST");
        }
    }); 
});

//kat.cr api for listing torrents
app.post('/add_file', function (req, res) {
  listTorrents(req.query.q, function (err, torrents) {
    if (err) {
      res.send(err);
    } else {
      res.send(torrents);
    }
  });
});

app.listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});


