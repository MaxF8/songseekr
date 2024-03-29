import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@mui/material/Box";
import Container from "@material-ui/core/Container";
import SpotifyWebApi from "spotify-web-api-node";
import {ThreeDots} from 'react-loader-spinner';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));

const spotifyApi = new SpotifyWebApi({
  clientId: "95e0f40c7fa44e0e99e6ce9b6fd5fa32",
});

const numberToLetterConverter = {
  0: "C",
  1: "C#",
  2: "D",
  3: "D#",
  4: "E",
  5: "F",
  6: "F#",
  7: "G",
  8: "G#",
  9: "A",
  10: "A#",
  11: "B",
};
const minorOrMajor = {
  0: "Minor",
  1: "Major",
};

const getAllTrackIDs = (data) => {
  const listOfIDs = [];

  for (let x in data) {
    listOfIDs[x] = data[x].track.id.toString();
  }

  let queryStringOfIds = "";

  for (let x in data) {
    queryStringOfIds += data[x].track.id + ",";
  }

  // console.log("songs!:");
  // console.log(listOfIDs )
  // return queryStringOfIds.slice(0, -1);
  console.log(listOfIDs);
  return listOfIDs;
};

const PlaylistData = (props) => {
  const location = useLocation();
  const state = location.state;
  const playlistID = state.id;
  // console.log(Object.keys(state));
  // console.log(playlistID);

  const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

  const [token, setToken] = useState("");
  const [IDs, setIDs] = useState([]);

  const [data, setData] = useState({});
  const [audioFeatures, setAudioFeatures] = useState({});
  const [isLoading, setLoading] = useState(true);

  // const [Key, setKey] = useState("");
  // const [Mode, setMode] = useState("");

  
  useEffect(() => {
    // console.log(`tracks from playlist id ${state.name}`);

    // if (localStorage.getItem("access_token")) {
    setToken(localStorage.getItem("access_token"));
    spotifyApi.setAccessToken(localStorage.getItem("access_token"));

    // const dat = getSimplePlaylistTracks(playlistID)

    (async () => {
      try {
        spotifyApi.setAccessToken(localStorage.getItem("access_token"));

        const tracks = await spotifyApi
          .getPlaylist(playlistID.toString())
          .then();

        setData(tracks.body.tracks);
        console.log(tracks.body.tracks);

        const IDsReturned = getAllTrackIDs(tracks.body.tracks.items);

        const theData = await spotifyApi.getAudioFeaturesForTracks(IDsReturned);

        const keys = {};

        for (let x in theData.body.audio_features) {
          keys[x] = {
            key: theData.body.audio_features[x].key,
            mode: theData.body.audio_features[x].mode,
          };
        }
        // console.log(
        // keys)

        setAudioFeatures(keys);
        setLoading(false);
      } catch (err) {
        console.error("Error: something was wrong in spotifyFunctions", err);
        console.error(err.stack);
      }
    })();
  }, []); //data????

  if (isLoading) {
    return <>
    
    <ThreeDots
    // type="ThreeDots"
    color="black"
    height={100}
    width={100}
  /></>
    {/* <div className="App">Loading...</div>; */}
  }
  return (
    <>
      {/* {console.log("!!!!!")} */}

      {/* {console.log(audioFeatures)} */}
      <Box
        // borderColor="red"
        // height={300}
        // width={300}
        minHeight="20vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        // bgcolor="blue"
        // color="white"
        fontSize={24}
      >
        Playlist Data
      </Box>
      <Container maxWidth="md">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Song</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Album</TableCell>
            </TableRow>
          </TableHead>
          {/* {console.log("now")}

          {console.log(data)}
          {console.log("^")} */}
          {/* {console.log(audioFeatures)}  */}

          <TableBody>
            {data?.items
              ? data.items.map((item, x) => {
                  return (
                    <TableRow key={item.track.name}>
                      {/* {console.log(`name: ${item.track.name}`)} */}
                      {/* {console.log("audioFeatures")} */}

                      {/* {console.log(audioFeatures[0])} */}
                      {/* {console.log("^")} */}

                      <TableCell component="th" scope="row">
                        {/* <Link to={`/playlistName/${item.name}`}>{item.name}</Link> */}
                        <Link to="/SongData" state={item}>
                          {item.track.name}
                        </Link>
                      </TableCell>

                      <TableCell>
                        {numberToLetterConverter[audioFeatures[x].key]}
                      </TableCell>
                      <TableCell>
                        {minorOrMajor[audioFeatures[x].mode]}

                      </TableCell>
                      <TableCell>{item.track.name}</TableCell>
                      <TableCell>{item.track.album.name}</TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};
export default PlaylistData;
