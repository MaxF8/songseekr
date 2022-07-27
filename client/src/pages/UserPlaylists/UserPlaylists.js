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
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
// import { Link } from 'react-router-dom';
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));

const UserPlaylists = (props) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});
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

        let result = response.data.items;
        console.log(result);
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
      <Table>
        <TableHead>
          <TableRow></TableRow>
        </TableHead>
        <TableBody>
          {data?.items
            ? data.items.map((item) => {
                return (
                  <TableRow key={item.name}>
                    <TableCell component="th" scope="row">
                      <Link to="/playlistData" state={item}>
                        {item.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
    </>
  );
};

export default UserPlaylists;
