// spotify auth

// Get the hash of the url
const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'efa3f1fb8e4c4cd79065e8b4bec6f59a';
const redirectUri = 'https://blendr.glitch.me';
const scopes = [
  'playlist-read-private', 'playlist-modify-private'
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// -----


// event listeners

var selection = [];

var opac = 0.6;

var footer_text = document.getElementById("footer_p");

var a1,a2,a3,a4,a5,a6 = [];
  
// single track list array per playlist?

// keeping list definitions in listeners will only fill them on click

document.getElementById("pl_1").addEventListener("click", function(){
  
  click("pl_1");
  
});

document.getElementById("pl_2").addEventListener("click", function(){
  
  click("pl_2")
  
});

document.getElementById("pl_3").addEventListener("click", function(){
  
  click("pl_3")
  
});

document.getElementById("pl_4").addEventListener("click", function(){
  
  click("pl_4")
  
});

document.getElementById("pl_5").addEventListener("click", function(){
  
  click("pl_5")
  
});

document.getElementById("pl_6").addEventListener("click", function(){
  
  click("pl_6")
  
});

// TODO: add listeners for pl_7 - pl_9


// playlist functions

function click(pl){
  
  if (! selection.includes(pl)) {
    selectPlaylist(pl)
  }

  else {
    deselectPlaylist(pl)
  }
  
}

function selectPlaylist(pl){
  
  console.log(pl + " added to the mix!")
  selection.push(pl)
  console.log(selection)
  
  document.getElementById(pl).style.opacity = opac;
  footer_text.innerHTML = "Select playlists you want to add to the mix! (" + selection.length + ")";
  
}

function deselectPlaylist(pl){
  
  console.log(pl + " removed from the mix!")
  selection.splice(selection.indexOf(pl), 1);
  console.log(selection);
  
  document.getElementById(pl).style.opacity = 1.0;
  footer_text.innerHTML = "Select playlists you want to add to the mix! (" + selection.length + ")";

}


// blend button

document.getElementById("blend_button").addEventListener("click", function(){
  console.log("Creating your mix from "  + selection + " ..");
  
  if (selection.length > 1){
    footer_text.innerHTML = "Creating your mix from " + selection.length + " playlists..";
    
    // sleep
    setTimeout(function(){ 
        footer_text.innerHTML = "Check for your fresh Playlist Smoothie on Spotify!";
    }, 1200);
    
    // have something happen here
    
    // strategy pattern?
    console.log(tracks.slice(0,selection.length*3));
    
    var t;
    
    for (t in tracks) {
      console.log(tracks[t].uri);
    }
    
    // https://api.spotify.com/v1/ME/playlists
    
    // create playlist
    
    $.ajax({
    url: "https://api.spotify.com/v1/me/playlists/",
    type: "POST",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    contentType: "application/json",
    dataType: "json",    
    data: JSON.stringify({ "name" : "Playlist Smoothie", "description" : "Created from blendr.glitch.me", "public" : false }),
    success: function(response) {
      
      console.log(response);
      
      // TODO: add tracks to playlist
      
      var JSONtrackURIs = [];
      
      for (t in tracks) {JSONtrackURIs.push(tracks[t].uri);}
      
      JSONtrackURIs = JSON.stringify( { "uris" : JSONtrackURIs } );
      
      console.log(JSONtrackURIs);
      addTracks(response.id, JSONtrackURIs);

    }

  });
    
    
    
  }
  else{
    footer_text.innerHTML = "Select at least 2 playlists to create a mix!"; 
  }
});


// function to add a single track to a playlist via request url
function addTrack(playlist_id, track_uri){
  
  $.ajax({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + track_uri,
    type: "POST",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    contentType: "application/json",
    dataType: "json",    
    success: function(response) {
      
      console.log(response);

    }

  });
  
}

// function to add multipe tracks to a playlist via request body
function addTracks(playlist_id, track_uris){
  
  $.ajax({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
    type: "POST",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    contentType: "application/json",
    dataType: "json",    
    data: track_uris,
    success: function(response) {
      
      console.log(response);

    }

  });
  
}

var limit = 6;

var playlist_ids = [];

$.ajax({
  url: "https://api.spotify.com/v1/me/playlists?limit=" + limit,
  type: "GET",
  beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
  success: function(data) {
    
    var p = 1;
    
    // Do something with the returned data
    data.items.map(function(playlist) {
      
      // use a dict with name:id??
      console.log(playlist.name);
      playlist_ids.push(playlist.id);
      
      //console.log(playlist.images[0].url);
      
      var pl = "pl_" + p;
      
      document.getElementById(pl).src = playlist.images[0].url;
      
      p = p + 1;
      
      
      getPlaylistTracks(playlist.id);
      
    });
    
    console.log(playlist_ids);
    
  }

});

var tracks = [];

// hard coded limit here!
function getPlaylistTracks(playlist_id){

  $.ajax({
    url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?limit=3",
    type: "GET",
    beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
    success: function(data) {
      // Do something with the returned data
      
      console.log("TRACKS FROM PLAYLIST: " + playlist_id);
      
      data.items.map(function(items) {
        
        console.log(" - " + items.track.name);
        
        // passing the entire track object
        tracks.push(items.track);

      });

    }

  });
  
}

// how to mix playlists? strategy pattern?

// everything is asynchronous