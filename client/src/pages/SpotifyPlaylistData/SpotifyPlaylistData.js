import React, { useState, useEffect } from 'react';

import axios from 'axios';

const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";

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

const SpotifyPlaylistData  = () => {

  const [token, setToken] = useState("");
  const [data, setData] = useState({});
  
  useEffect(() => {
    console.log("spotify data")
    // if (localStorage.getItem("access_token")) {
      setToken(localStorage.getItem("access_token"));
    // }
  }, []);

  const handleGetPlaylists = () => {
    console.log(`token: ${localStorage.getItem("access_token")}`)
    axios
      .get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
          "Content-Type": "application/json"
        },
      })
      .then((response) => {
    console.log("response data")

        let result = response.data.items
        console.log(result)
        for (let playlist in result)
        {
          console.log(result[playlist].name)
        }
        // console.log("playlist data: "+JSON.stringify(response.data))

        setData(response.data);
      })
      .catch((error) => {   
        console.log(error);
      });
  };

  return (
    <>
      <button onClick={handleGetPlaylists}>Get Playlists</button>
          {data?.items ? data.items.map((item) => <p key={item.name}>{item.name}</p>) : null}
    </>
  )
}

export default SpotifyPlaylistData;