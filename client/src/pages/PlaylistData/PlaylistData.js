import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import KeyAndMode from "./KeyAndMode";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from '@mui/material/Box';
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));


const listOfSongFeatures = (querySting) => {
  // console.log(querySting)
  const SONG_FEATURES_ENDPOINT = `https://api.spotify.com/v1/audio-features?ids=${querySting}`;
    // console.log(props)
    // console.log(`id: ${id}`);
    // setToken(localStorage.getItem("access_token"));
    // console.log(`token (song features): ${token}`)
    axios
      .get(SONG_FEATURES_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // console.log("audio feature request")
        // console.log(response.data.audio_features)

        const data = response.data.audio_features;

        const listOfIDs = {};

        for (let x in data){ 
          // listOfIDs[x] = data[x]
          // console.log(data[x].key)
          listOfIDs[x] = {
            [data[x].key ] : data[x].mode
          }
          // console.log(`${data[x].track.id} and ${data[x].track.name}`);
        }
        // console.log("undef?")

        // console.log(listOfIDs)
        // let result = response.data
        // //   console.log(Object.keys(result[0].track))
        // for (let x in result)
        // {
        //     console.log(result[x].audio_features)
        // }
        // console.log("playlist data: "+JSON.stringify(response.data))
        // setData(response.data);
        console.log(listOfIDs)
        return listOfIDs;
      })
      .catch((error) => {
        console.log(error);
      });
}

const getAllTrackIDs = (data) => {
  const listOfIDs = {};

  let queryStingOfIds = ""
  for (let x in data){ 
    queryStingOfIds += data[x].track.id + ",";
  }

  // console.log("songs!:");
  // console.log(listOfIDs )

  return queryStingOfIds.slice(0, -1);;
};

const PlaylistData = (props) => {
  const location = useLocation();
  const state = location.state;
  const playlistID = state.id;
  // console.log(Object.keys(state));
  // console.log(playlistID);

  const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  // const [audioFeatures, setAudioFeatures] = useState({});

  // const [Key, setKey] = useState("");
  // const [Mode, setMode] = useState("");

  useEffect(() => {
    // console.log(`tracks from playlist id ${state.name}`);

    // if (localStorage.getItem("access_token")) {
    setToken(localStorage.getItem("access_token"));
    // }
    //
    // console.log(`token: ${localStorage.getItem("access_token")}`);
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        let result = response.data.items;
        // console.log(Object.keys(result[0].track));
        // console.log(response.data.items);

        // for (let x in result) {
        //   // console.log(result[x].track.name);
        // }
        // // console.log("playlist data: "+JSON.stringify(response.data))
        // const IDs = getAllTrackIDs(response.data.items);
        // // console.log("did it work?")
        // console.log("--")
        
        // console.log(IDs)
        // const returnedAudioFeatures = listOfSongFeatures(IDs);
        // console.log(returnedAudioFeatures)
        // console.log("___")

        // setAudioFeatures(listOfSongFeatures(IDs))
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]); //data????
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
      fontSize={24}>
        
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
        <TableBody>
          {data?.items
            ? data.items.map((item) => {
                return (
                  <TableRow key={item.track.name}>
                    {/* {console.log(`name: ${item.track.name}`)} */}

                    <TableCell component="th" scope="row">
                      {/* <Link to={`/playlistName/${item.name}`}>{item.name}</Link> */}
                      <Link to="/SongData" state={item}>
                        {item.track.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <KeyAndMode id={item.track.id} isKeyTrue={true} />
                    </TableCell>
                    <TableCell>
                      <KeyAndMode id={item.track.id} isKeyTrue={false} />
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
