var request = require('request');

function makeKickassUrl(query) {
    return "https://kat.cr/json.php?q=" + encodeURIComponent(query) + "&field=seeders&order=asc";
}

function formatTorrentList(responseBody) {
    var response = JSON.parse(responseBody);
    var torrents = response.list;
    var formattedResponse = [];
    
    for (var i = 0; i < 7; i++) {
        formattedResponse.push(torrents[i]);
    }
    
    return formattedResponse;
}

module.exports = function listTorrents(query, callback) {
    var requestOptions = {
        url: makeKickassUrl(query),
        method: "GET"
    };
    
    request(requestOptions, function (err, res, body) {
         if(err) {
             return callback(err);
         }
         
         try {
             var formattedResponse = formatTorrentList(body);
             callback(null, formattedResponse);
         } catch (e) {
             callback(e);
         }
    });    
}