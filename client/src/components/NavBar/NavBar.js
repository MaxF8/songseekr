import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { Button } from '../../styles/globalStyles';

// import {  Link } from "react-router-dom";
// import "./NavBar.css"
// import { Nav } from "react-bootstrap";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

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
} from './NavBarElements';


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
            {/* <NavItem>
              <NavLinks to='/contact' onClick={closeMobileMenu}>
                Contact
              </NavLinks>
            </NavItem> */}
            <NavItemBtn>
              {button ? (
                <NavBtnLink to='/sign-up'>
                  <Button primary>Log In</Button>
                </NavBtnLink>
              ) : (
                <NavBtnLink to='/sign-up'>
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
      <Routes>
        <Route path="/about" element={<About />} /> 
      </Routes>

    </Nav> */}
  </>
    
  )
}


export default NavBar;
