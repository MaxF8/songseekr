import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";

import Container from "@material-ui/core/Container";
import Box from '@mui/material/Box';


//image list
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";


// import { Link } from 'react-router-dom';
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));

const UserPlaylists = (props) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  // const [artists, setArtists] = useState([]);
  useEffect(() => {
    setToken(localStorage.getItem("access_token"));
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
  console.log("user playlists")

        let result = response.data;
        console.log(result);
        console.log("^")
        // for (let playlist in result) {
          // console.log(result[playlist].name);
        // }
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

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
        
      Your Playlists

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
              <Link to="/playlistData" state={artist}>

              <ImageListItem
                sx={{ height: "100% !important" }}
                // columns = {3}
                key={artist.name}
              > 
                <img
                  src={`${artist?.images[0]?.url}?w=248&fit=crop&auto=format`}
                  // srcSet={`${artist?.images[0]?.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt=""
                  loading="lazy"
                  style={{ cursor: "pointer" }}
                />
                <ImageListItemBar title={artist.name} />

              </ImageListItem>
                </Link>

            );
          })}
        </ImageList>
      </Container>
    </>
  );
};

export default UserPlaylists;
