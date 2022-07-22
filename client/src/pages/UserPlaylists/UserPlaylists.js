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
// import { Link } from 'react-router-dom';
const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
}));

// const getAudioFeatures_Track = async (access_token) => {
//   const api_url = `https://api.spotify.com/v1/me/playlists`;
//   try{
//     const response = await axios.get(api_url, {
//       headers: {
//         'Authorization': `Bearer ${access_token}`,
//         'Content-Type': 'application/json'
//       }
//     });

//     console.log(response.data.items[1].name);
//     return response.data;
//   }catch(error){
//     console.log(error);
//   }
// };

const UserPlaylists = (props) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    console.log("spotify data");
    // if (localStorage.getItem("access_token")) {
    setToken(localStorage.getItem("access_token"));
    console.log(token);
    // }
    //
    // console.log(`token: ${token}`)
    // console.log(localStorage.getItem("access_token"))

    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("response data");

        let result = response.data.items;
        console.log(result);
        for (let playlist in result) {
          console.log(result[playlist].name);
        }
        // console.log("playlist data: "+JSON.stringify(response.data))

        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  // const handleGetPlaylists = () => {
  //   console.log(`token: ${localStorage.getItem("access_token")}`)
  //   axios
  //     .get(PLAYLISTS_ENDPOINT, {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("access_token"),
  //         "Content-Type": "application/json"
  //       },
  //     })
  //     .then((response) => {
  //       console.log("response data")

  //       let result = response.data.items
  //       console.log(result)
  //       for (let playlist in result)
  //       {
  //         console.log(result[playlist].name)
  //       }
  //       // console.log("playlist data: "+JSON.stringify(response.data))

  //       setData(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  return (
    <>
      {/* <button onClick={handleGetPlaylists}>Get Playlists</button> */}
      {/* <Routes> */}

      <Table>
        <TableHead>
          <TableRow>
            {/* <TableCell>Data</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Count</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* <TableRow key={}> */}
          {/* 
          {
            data?.items ?
            data.items.map((item) => (
              <div>uhnkm</div>
            )
            :
             null
          )
          } */}
          {data?.items
            ? data.items.map((item) => {
                return (
                  <TableRow key={item.name}>
                    <TableCell component="th" scope="row">
                      {/* <Link to={`/playlistName/${item.name}`}>{item.name}</Link> */}
                      <Link to="/playlistData" state={item}>
                        {item.name}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            : null}

          {/* } */}
          {/* </TableRow> */}
        </TableBody>
      </Table>
      {/* </Routes> */}
    </>
  );
};

export default UserPlaylists;
