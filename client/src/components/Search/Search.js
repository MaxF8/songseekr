import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import axios from "axios";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import MUIButton from "@mui/material/Button";
import MUIContainer from "@mui/material/Container";
import Box from "@mui/material/Box";
import "./Search.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
} from "react-bootstrap";
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/search?q=";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  // useEffect(() => {

  //   setToken(localStorage.getItem("access_token"));
  //   axios
  //     .get(PLAYLISTS_ENDPOINT+searchInput+"&type=artist", {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("access_token"),
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((response) => {
  //     console.log("Search")

  //       let result = response.data.items;
  //       console.log(result);
  //       // for (let playlist in result) {
  //         // console.log(result[playlist].name);
  //       // }
  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [token]);

  async function search() {
    console.log("Search for searchInput: " + searchInput);

    let artistParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let returnedArtists = await fetch(
      PLAYLISTS_ENDPOINT + searchInput + "&type=artist",
      artistParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.artists);
        setArtists(data.artists.items);
      });
  }

  return (
    <div className="Search">
      <MUIContainer>
        <InputGroup className="mb-3" size="lg">
          <FormControl
            placeholder="Search Here"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                console.log("Enter!!!!");
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button
            onClick={() => {
              console.log("click!!");
              search();
              // console.log(artists)
            }}
          >

            Search
          </Button>

        </InputGroup>
        {/* why box?, container?? */}
      </MUIContainer>
      <MUIContainer maxWidth="md">
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
          {artists.map((artist, i) => {
            return (
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
            );
          })}
        </ImageList>
      </MUIContainer>
    </div>

  );
};

export default Search;
