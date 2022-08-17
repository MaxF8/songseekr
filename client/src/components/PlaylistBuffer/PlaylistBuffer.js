import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import PlaylistData from "../../pages/PlaylistData";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

const spotifyApi = new SpotifyWebApi({
    clientId: "95e0f40c7fa44e0e99e6ce9b6fd5fa32",
  });


const PlaylistBuffer = (props) => {
    const location = useLocation();
    const state = location.state;
    const playlistID = state.id;

    const [token, setToken] = useState("");
    const [data, setData] = useState({});

    useEffect(() => {
        setToken(localStorage.getItem("access_token"));
        
        // (async () => {
    
            try {
              spotifyApi.setAccessToken(localStorage.getItem("access_token"));
        
                const tracks =  spotifyApi.getPlaylist(playlistID.toString()).then(
        
                  
                )
                console.log(tracks)
        
                setData(tracks.body.tracks)
                
            }
            catch(err) {
                console.error('Error: something was wrong in spotifyFunctions', err);
                console.error(err.stack);
            }
          
          })();


    // }, []);

  return (
    <>
    {console.log("data")}

    {console.log(data)}
    {console.log("^")}

        <PlaylistData state ={data} />
    </>
  );
};

export default PlaylistBuffer;
