import React from "react";

// import Dashboard from './Dashboard';
// import Login from './Login';
import Main from "./components/Main";
import Login from "./components/Login";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";


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

import { Card } from "react-bootstrap";
import LoginPage from "./components/LoginPage";

const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  console.log(`code: ${code}`);
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route
           exact 
          path="/"
          element={ 
            <div>
              {code ? (
                /*if code is true, you are logged in*/
                <div>
                  <Main code={code} />
                  <HomePage/>
                </div>
              ) : (
                /*if code is false, you are logged out*/
                <LoginPage />
              )}
            </div>
           } 
        /> 
        <Route path="/about" element={<About />} />
        <Route path="/playlists" element={<UserPlaylists/>}/>  

        </Routes>



      <Footer />
    </Router>
  );
};
export default App;
