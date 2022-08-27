import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Song from "../../components/Song";
import PlaylistData from "../../pages/PlaylistData";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

import TableHead from "@material-ui/core/TableHead";
import Container from "@material-ui/core/Container";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";


import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";

//image list
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import Loader from 'react-loader-spinner'

import SpotifyWebApi from "spotify-web-api-node";

// import { Link } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));


const spotifyApi = new SpotifyWebApi({
  clientId: "95e0f40c7fa44e0e99e6ce9b6fd5fa32",
});

const LikedSongData = (props) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  // const [artists, setArtists] = useState([]);
  useEffect(() => {
    console.log("album")
    setToken(localStorage.getItem("access_token"));
    spotifyApi.setAccessToken(localStorage.getItem("access_token"));
   
    spotifyApi.getMySavedTracks()
    .then(function(data) {
      console.log(data.body);
      setData(data.body)
    }, function(err) {
      console.log('Something went wrong! (liked songs)', err);
    });

   
   
   
  
  }, []);

  return (
    <>
      {/* <Container>

        Playlists
      </Container> */}
      {/* <Container maxWidth="sm" >a */}
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
        
      Your Liked Songs

      </Box>
      {/* </Container> */}

      <Container maxWidth="md">
        <ImageList
          gap={25}
          cols={3}
          sx={{
            mb: 8,
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))!important",
          }}
          // sx={{ width: 500, height: 450}}
          // mb= {8}
          // gridTemplateColumns:
          //   "repeat(auto-fill, minmax(280px, 1fr))!important",
        >
          {
            data?.items?.map((artist, i) => {
            return (
              <Link to="/playlistData" state={artist}> {/*get rid of "Artist */ }
              {console.log(artist)}
              <ImageListItem
                sx={{ height: "100% !important" }}
                // columns = {3}
                key={artist.track.name}
              > 
                <img
                  src={`${artist?.track.album.images[0]?.url}?w=248&fit=crop&auto=format`}
                  // srcSet={`${artist?.images[0]?.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt=""
                  loading="lazy"
                  style={{ cursor: "pointer" }}
                />
                <ImageListItemBar title={artist.track.name} />

              </ImageListItem>
                </Link>

            );
          })}
        </ImageList>
      </Container>
    </>
  );
};

export default LikedSongData;
