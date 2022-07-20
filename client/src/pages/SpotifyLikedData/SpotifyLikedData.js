
import React, { useState, useEffect } from 'react';

import axios from 'axios';

// const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";


const SpotifyLikedData  = () => {

    const handleGetPlaylists = () => {
        console.log("liked data here")
    }

  return (
    <>
      <button onClick={handleGetPlaylists}>Get Liked Songs</button>
          {/* {data?.items ? data.items.map((item) => <p key={item.name}>{item.name}</p>) : null} */}
    </>
  )
}



export default SpotifyLikedData