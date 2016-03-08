document.getElementById("loginButton").onclick = function () { 
    window.location = ('https://api.put.io/v2/oauth2/authenticate?client_id=2332&response_type=code&redirect_uri=http://autotorrent.herokuapp.com/put_oauth');
}


function listTorrents() { 
  params = "q=" + document.getElementById("filename").value;
  xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('success');
      var str = '<ul>';
            
      Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
          if (this[i] == deleteValue) {         
            this.splice(i, 1);
            i--;
          }
        }
        
        return this;
      };
            
      JSON.parse(xmlhttp.responseText).clean(null).forEach(function(el){
        console.log('building');
        str += '<li><a href="http://autotorrent.herokuapp.com/add_to_put?q=' + el.torrentLink + '"> Title: ' + el.title + ' Seeds: ' + el.seeds + '</a></li>';
      })
      str += '</ul>'; 
      console.log(str);
      document.getElementById("links").innerHTML = str;       
    }
  }; 
  xmlhttp.open("POST", "/add_file?" + params, true);
  xmlhttp.send(null); 
}

document.getElementById("clickMe").onclick = function(){
    listTorrents();
}

document.getElementById("filename").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        e.preventDefault();
        listTorrents();
    }
});
