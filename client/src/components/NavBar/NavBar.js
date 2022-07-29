import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../../styles/globalStyles';
import Main from "../Main"
// import {  Link } from "react-router-dom";
// import "./NavBar.css"
// import { Nav } from "react-bootstrap";

import About from "../../pages/About"


import {
  Nav,
  NavbarContainer,
  NavLogo,
  NavIcon,
  MobileIcon,
  NavMenu,
  NavItem,
  NavItemBtn,
  NavLinks,
  NavBtnLink
} from './NavBarStyling';
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private`;


const NavBar  = () => {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
  
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
  
    const showButton = () => {
      if (window.innerWidth <= 960) {
        setButton(false);
      } else {
        setButton(true);
      }
    };
    const goToAUTH_URL = () => {
      window.location.replace(AUTH_URL)
    };
  
    useEffect(() => {
      showButton();
    }, []);
  
    window.addEventListener('resize', showButton);
  

  return  (
    
    <>
    <IconContext.Provider value={{ color: '#fff' }}>
      <Nav>
        <NavbarContainer>
          <NavLogo to='/' onClick={closeMobileMenu}>
            <NavIcon />
            Spotify App
          </NavLogo>
          <MobileIcon onClick={handleClick}>
            {click ? <FaTimes /> : <FaBars />}
          </MobileIcon>
          <NavMenu onClick={handleClick} click={click}>
          <NavItem>
              <NavLinks to='/' onClick={closeMobileMenu}>
                Home
              </NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to='/about' onClick={closeMobileMenu}>
                About
              </NavLinks>
            </NavItem>
          <NavItem>
              <NavLinks to='/playlists' onClick={closeMobileMenu}>
                Playlists
              </NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to='/Liked Songs' onClick={closeMobileMenu}>
                Liked Songs
              </NavLinks>
            </NavItem>
            <NavItem>
              <NavLinks to='/Albums' onClick={closeMobileMenu}>
                Albums
              </NavLinks>
            </NavItem>

           
            {/* <NavItem>
              <NavLinks to='/contact' onClick={closeMobileMenu}>
                Contact
              </NavLinks>
            </NavItem> */}
            <NavItemBtn>
              {button ? (
                <NavBtnLink to="/">
                  <Button onClick={goToAUTH_URL} primary> Log In </Button>
                </NavBtnLink>
              ) : (
                <NavBtnLink to='/'>
                  <Button onClick={closeMobileMenu} fontBig primary>
                  Log In
                  </Button>
                </NavBtnLink>
              )}
            </NavItemBtn>
          </NavMenu>
        </NavbarContainer>
      </Nav>
    </IconContext.Provider>
    {/* <Nav className="NavBar-Items">
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
      
      </ul>
      </div>
     

    </Nav> */}
  </>
    
  )
}


export default NavBar;
