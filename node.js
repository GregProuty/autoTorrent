var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/add_to_put', function(req, res) {
    var request = require('request');
      var fs = require('fs');
      
      var torrent_options = {
        uri: req.query.q,
        method: 'GET'
      }
      request(torrent_options, function(error, response, body) {
        if (!error) {
          fs = require('fs')
          var oauth_key = fs.readFileSync('key.txt','utf8')
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
                        if (title === parsed_event.transfer_name) {
                            res.redirect('http://put.io/file/' +  parsed_event.file_id)
                        } else {
                            res.redirect('http://put.io/transfers')
                        }
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
          res.send(error + "error")
        }
      }).pipe(fs.createWriteStream('temp_torrent.torrent'));
});

app.get('/put_oauth', function(req, res) {
    var request = require('request');
    var put_options = {
        uri: "https://api.put.io/v2/oauth2/access_token?client_id=2332&client_secret=mr5bvnvcql9c5h0iv774&grant_type=authorization_code&redirect_uri=http://localhost:3000/put_oauth&code=" + encodeURIComponent(req.query.code),
        method: "GET",
        timeout: 5000
    };
    
    var parsed_body = null;
  request(put_options, function (error, response, body) {
    if (!error) {
        var fs = require('fs');
        console.log(body)
        fs.writeFile('key.txt', JSON.parse(body).access_token, function (err) {
            if (err) return console.log(err);
            res.redirect('/')
        });
    } else {
      res.send(error + "TEST");
    }
  }); 
});

app.post('/add_file', function (req, res) {
  var request = require('request');
  var kickass_options = {
    url: "https://kat.cr/json.php?q=" + encodeURIComponent(req.query.q) + "&field=seeders&order=asc",
    method: "GET",
    timeout: 5000
  };

  var torrentLink;
  request(kickass_options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(JSON.parse(body).list.map(function(currentValue,index,array){
          if(index < 5){
            console.log(currentValue);  
            
            return currentValue;
            //   currentValue.title.forEach(function(el){
            //       str += el;
            //   });
          }
      }));
    } else {
      res.send(error)
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

