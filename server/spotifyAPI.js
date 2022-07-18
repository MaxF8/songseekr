
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const querystring = require('querystring');

require('dotenv').config();

const scopes = [
  // 'ugc-image-upload',
  // 'user-read-playback-state',
  // 'user-modify-playback-state',
  // 'user-read-currently-playing',
  // 'streaming',
  // 'app-remote-control',
  // 'user-read-email',
  // 'user-read-private',
  // 'playlist-read-collaborative',
  // 'playlist-modify-public',
  'playlist-read-private',
  // 'playlist-modify-private',
  // 'user-library-modify',
  // 'user-library-read',
  'user-top-read',
  // 'user-read-playback-position',
  // 'user-read-recently-played',
  // 'user-follow-read',
  // 'user-follow-modify'
];

//set credentials for Spotify API object
const spotifyApi = new SpotifyWebApi({ 
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

const app = express();


app.get('/login', (req, res) => {
  console.log(process.env.CLIENT_ID)
  console.log("login")
  let redirectUrl =  spotifyApi.createAuthorizeURL(scopes);
  // console.log(redirectUrl)
  res.redirect(redirectUrl);
});


app.get('/callback', (req, res) => {
  console.log("CALLBACK")
  const error = req.query.error;
  const code = req.query.code;
  console.log(req.query)

  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }
  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      // console.log("data: "+JSON.stringify(data.body))
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];
      // process.env.ACCESS_TOKEN = access_token;
      // process.env.REFRESH_TOKEN = refresh_token;
      
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
   
      spotifyApi.getMyTopTracks({time_range:"long_term",limit: 5 })
      .then(function(data) {
        let topTracks = data.body;
        let n = 1;
        topTracks.items.forEach(function(track) {
            // console.log(n++ + ": "+track.name);
        });
      });

      console.log(
        `Sucessfully retreived access token.`
      );
      // console.log(access_token)

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
        expires_in
      });
      console.log(queryParams);
      res.redirect(`http://localhost:3000/?${queryParams}`);
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

// app.get('/top', (req, res) => {
//   console.log("top charts")

// });
app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  )
);

