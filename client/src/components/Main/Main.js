import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import "./Main.css"
import SpotifyConnection from "../../pages/SpotifyConnection"
import SpotifyAlbumData from "../../pages/SpotifyAlbumData"
import SpotifyLikedData from "../../pages/SpotifyLikedData"
import PlaylistData from "../../pages/PlaylistData"
import SongData from "../../pages/SongData"
import About from "../../pages/About"



import UserPlaylists from "../../pages/UserPlaylists"
import useAuth from '../../hooks/useAuth';
import SpotifyWebApi from 'spotify-web-api-node';

//login/logout

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
  });
  

const Main = ({code}) =>{
    const accessToken = useAuth(code);
    const [isLoggedin, setIsLoggedin] = useState(false);
   
    //   localStorage.setItem("expires_in", params.get("expires_in"))
    // console.log(`MAIN, token: ${accessToken}`);

    useEffect(() => {

        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
      }, [accessToken]);
    
//   useEffect(() => {
    // console.log(`code!: ${code}`)

    // console.log(localStorage.getItem("access_token"))
    // const login = () =>{
    //     window.location='http://localhost:8888/login';
    //     console.log("logged in!")
    //     const url = window.location.search
    //     const params = new URLSearchParams(url);
    //     localStorage.clear();
  
    //     localStorage.setItem("access_token", params.get("access_token"))
    //     localStorage.setItem("expires_in", params.get("expires_in"))

    //     setIsLoggedin(true);

    // }
   
    const logout = () =>{
            localStorage.clear();
            window.location.href = '/';
        console.log("logged out!")

        // localStorage.removeItem("access_token")
        // localStorage.removeItem("expires_in")
        // window.location.href = 'localhost:3000';
        // setIsLoggedin(false);
    }
//   })

    return(
         <div className="Main">
            <button onClick={logout}>logout user</button>
            {/* <div>Main</div> */}
            
            {/* <div>logged in</div> */}
            <Routes>
                <Route path="/" element={
                    <div>
                        <div>
                            <Link to = "/playlists">Playlists</Link>
                        </div>
                        <div>
                            <Link to = "/albums">Albums</Link>
                        </div>  
                        <div>
                            <Link to = "/liked">Liked Songs</Link>
                        </div>
                       
                    </div>
                } /> 

            </Routes>
        </div>
    )
}

export default Main;
