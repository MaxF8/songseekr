import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useLocation} from "react-router-dom"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import KeyAndMode from "./KeyAndMode"
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
  }));

const PlaylistData = (props) => {
    const location = useLocation();
    const state = location.state;
    const playlistID = state.id
    // console.log(Object.keys(state));
    console.log(playlistID)

    const PLAYLISTS_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

    
    const [token, setToken] = useState("");
    const [data, setData] = useState({});
    // const [Key, setKey] = useState("");
    // const [Mode, setMode] = useState("");


    useEffect(() => {
        console.log(`tracks from playlist id ${state.name}`)

        // if (localStorage.getItem("access_token")) {
          setToken(localStorage.getItem("access_token"));
        // }
        // 
        console.log(`token: ${localStorage.getItem("access_token")}`)
        axios
          .get(PLAYLISTS_ENDPOINT, {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json"
            },
          })
          .then((response) => {
            console.log("playlist data")
    
            let result = response.data.items
            console.log(Object.keys(result[0].track))
            for (let x in result)  
            {
              console.log(result[x].track.name)
            }
            // console.log("playlist data: "+JSON.stringify(response.data))
    
            setData(response.data);
          })  
          .catch((error) => {   
            console.log(error);
          });
      }, [token]); //data????
    return (
        <>  
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>Song</TableCell>
              <TableCell>Key</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items 
            ?   
              data.items.map((item) => {
                {/* console.log(`id!!! ${item.track.id}`) */}
                     {/* const keyAndMode = getKeyAndMode(item.track.id) */}
                     {/* console.log(keyAndMode) */}
                
                return (  
                  <TableRow key={item.track.name}>
                  {/* {console.log(`name: ${item.track.name}`)} */}

                    <TableCell component="th" scope="row">
                      {/* <Link to={`/playlistName/${item.name}`}>{item.name}</Link> */}
                      <Link to="/SongData" state={item}>
                      {item.track.name}</Link>
                    </TableCell>
                   
                    <TableCell>
                        <KeyAndMode id = {item.track.id} isKeyTrue = {true}/>
                    </TableCell>
                    <TableCell>
                        <KeyAndMode id = {item.track.id} isKeyTrue = {false}/>
                        </TableCell>
                  </TableRow>
                )
                }
              )
            : 
            null}

          {/* } */}
          {/* </TableRow> */}

          </TableBody>
          
          </Table>
        </>
    )
}
export default PlaylistData
