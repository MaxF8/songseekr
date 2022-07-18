import React, { useState, useEffect } from 'react';

import "./Main.css"
import SpotifyConnection from "../../pages/SpotifyConnection"
import SpotifyPlaylistData from "../../pages/SpotifyPlaylistData"
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

         <div className="Main">Spotify App!
            {/* <h1> <a href="http://localhost:8888/login">Login</a> to Spotify</h1> */}
            {/* <SpotifyConnection/> */}
{/*            
            {console.log(isLoggedin)}
            {!isLoggedin ? (
                <>
                    <div>logged out</div>
                    <button type="submit" onClick={login}>login</button>
                </>
            ):
            (
                <>
                    <div>logged in</div>
                    <button onClick={logout}>logout user</button>
                    <SpotifyPlaylistData />

                </>
            )
            } */}
            <div>logged in</div>
            <button onClick={logout}>logout user</button>
            <SpotifyPlaylistData />
        </div>
    )
}

export default Main;
