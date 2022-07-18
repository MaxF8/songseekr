const express=  require('express');
const cors =  require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8888;

app.post('/login', async (req, res) => {
  const { code } = req.body;
    console.log("login")
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
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

// app.get('/lyrics', async (req, res) => {
//   const { artist, track } = req.query;
//   res.json({ lyrics });
// });

app.listen(PORT, (err) => {
  if (err) console.log(err);            
  console.log('listening on port', PORT);
});