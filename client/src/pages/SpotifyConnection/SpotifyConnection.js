// import React, { useEffect } from 'react';
// import "./SpotifyConnection.css"

// import SpotifyPlaylistData from "../SpotifyPlaylistData"


// const SpotifyConnection = () => {
//   useEffect(() => {
//       const url = window.location.search
//       // console.log("url: "+url)
//       const params = new URLSearchParams(url);
//       localStorage.clear();
  
//       localStorage.setItem("access_token", params.get("access_token"))
//       localStorage.setItem("expires_in", params.get("expires_in"))
//       // localStorage.setItem("1refreshToken", refreshToken)
//       // localStorage.setItem("1tokenType", token_type)
//       // const access_token = params.get("access_token") 
//     }
//   )


//     return (
//         <div className="SpotifyConnection">
//         <SpotifyPlaylistData />

//       </div>
//     )
// }
// export default SpotifyConnection