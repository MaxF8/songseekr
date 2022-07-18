import React from 'react';
import "./Login.css"

const Login = () =>{
    console.log(process.env.REACT_APP_CLIENT_ID)
    // const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=streaming%20playlist-read-private`;
  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private`;
    
    return(
        <div className="Login">
             <a href={AUTH_URL}>Login </a> with Spotify!!!
        </div>
    )
}

export default Login;
