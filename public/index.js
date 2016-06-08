//login button behavior
//directs to the put.io login page

document.getElementById("loginButton").onclick = function () { 
    window.location = ('https://api.put.io/v2/oauth2/authenticate?client_id=2332&response_type=code&redirect_uri=http://autotorrent.herokuapp.com/put_oauth');
}



