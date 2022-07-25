import React from "react";

// import Dashboard from './Dashboard';
// import Login from './Login';
import Main from "./components/Main";
import Login from "./components/Login";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { Container } from './styles/App.styles';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import About from "./pages/About";
// import Contact from "./pages/Contact";

import UserPlaylists from "./pages/UserPlaylists";
import SpotifyAlbumData from "./pages/SpotifyAlbumData";
import SpotifyLikedData from "./pages/SpotifyAlbumData";
import PlaylistData from "./pages/PlaylistData";
import SongData from "./pages/SongData";




const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  console.log(`code: ${code}`);
  return (
    <Router>

      <NavBar/>
      <Routes>

      <Route path="/" element ={
        <div>
          {code ? (
            /*if code is true, you are logged in*/
            <div> 
              <Main code={code} />
              {/* <div>d</div> */}
            </div> 
          ) : ( 
            /*if code is false, you are logged out*/
            <Login/>    
          )}
        </div>
      } />
      <Route path="/about" element={<About/>} /> 
      {/* <Route path="/contact" element={<Contact/>} />  */}

      <Route path="/playlists" element={<UserPlaylists/>}/> 
      <Route path="/albums" element={<SpotifyAlbumData/>} /> 
      <Route path="/liked" element={<SpotifyLikedData />} /> 
      <Route path="/playlistData" element={<PlaylistData />} />
      <Route path="/SongData" element={<SongData />} /> 
      </Routes>

    </Router>
  );
};
export default App;
