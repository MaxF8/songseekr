
const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node')
const dotenv = require('dotenv')
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, './client/build')))
dotenv.config();
const redirect_uri = process.env.NODE_ENV === 'production' ? 'https://spotnfind.com' : 'http://localhost:3000'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3001;
app.post('/login', async (req, res) => {

  const { code } = req.body;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: redirect_uri,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET, 
  });

  try {
    const {
      body: { access_token, refresh_token, expires_in },
    } = await spotifyApi.authorizationCodeGrant(code);

    res.json({ access_token, refresh_token, expires_in });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post('/refresh', async (req, res) => {
  console.log("refresh")
  const { refreshToken } = req.body;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  try {
    const {
      body: { access_token, expires_in },
    } = await spotifyApi.refreshAccessToken();
    res.json({ access_token, expires_in });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post('/callback', async (req, res) => {
  console.log("callback1")
});
app.get('/callback', async (req, res) => {
  console.log("callback2")
});
// app.get('*', (req, res) => { //in case
//   res.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
// });

app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log('listening on port', PORT);
});