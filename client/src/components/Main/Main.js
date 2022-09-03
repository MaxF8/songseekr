import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./Main.css";
import AlbumData from "../../pages/AlbumData";
import LikedSongData from "../../pages/LikedSongData";
import PlaylistData from "../../pages/PlaylistData";
import SongData from "../../pages/SongData";
import About from "../../pages/About";
import MUIButton from "@mui/material/Button";
import Box from "@mui/material/Box";

import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";

import UserPlaylists from "../../pages/UserPlaylists";

import useAuth from "../../hooks/useAuth";
import SpotifyWebApi from "spotify-web-api-node";
import Search from "../Search";
import HomePage from "../HomePage";
//login/logout

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Main = ({ code }) => {
  const accessToken = useAuth(code);
  const [isLoggedin, setIsLoggedin] = useState(false);

  //   localStorage.setItem("expires_in", params.get("expires_in"))
  // console.log(`MAIN, token: ${accessToken}`);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);





  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    console.log("logged out!");

   
  };

  return (
    <>
    

      <Routes>
        <Route path="/" element={<HomePage />}>Home page</Route>
        {/* <Route path="/playlistData" element={<PlaylistData />} /> */}
        <Route path="/playlistData" element={<PlaylistData />} />

        <Route path="/SongData" element={<SongData />} />
        <Route path="/about" element={<About />} />
        <Route path="/playlists" element={<UserPlaylists />} />
        <Route path="/albums" element={<AlbumData />} />
        <Route path="/likedSongs" element={<LikedSongData />} />


      </Routes>
    </>
  );
};

export default Main;
