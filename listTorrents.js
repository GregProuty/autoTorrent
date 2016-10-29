var request = require('request');

//makes a kickass torrents url to be used below
function makeKickassUrl(query) {
    return "https://kickass.cd/json.php?q=" + encodeURIComponent(query) + "&field=seeders&order=asc";
}

//formats the JSON list of torrents returned by the kickass api
function formatTorrentList(responseBody) {
    var response = JSON.parse(responseBody);
    var torrents = response.list;
    var formattedResponse = [];
    
    for (var i = 0; i < 7; i++) {
        formattedResponse.push(torrents[i]);
    }
    
    return formattedResponse;
}

//creates function to list torrents on page
//adjusted for errors
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