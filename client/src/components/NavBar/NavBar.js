import React, { useState, useEffect } from 'react';
import {  Link } from "react-router-dom";
import "./NavBar.css"
import { Nav } from "react-bootstrap";
// const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists/?limit=25";


const NavBar  = () => {
    

  return  (
    
      
    <Nav className="NavBar-Items">
      <div>
      <h1 className="NavBar-AppName">App Name</h1>
      <div className="menu-icon"></div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        {/* <li>
          <Link to="/contact">Contact</Link>
        </li> */}
      </ul>
      </div>
    </Nav>
  )
}


export default NavBar;
