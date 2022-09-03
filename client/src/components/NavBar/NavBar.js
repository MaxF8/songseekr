import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { Button } from "../../styles/globalStyles";
import LogoBlack from '../../assets/Spot-N-FindBlack.svg'


import Icon from '@material-ui/core/Icon';




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
  NavBtnLink,
} from "./NavBarStyling";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-read-private`;

const NavBar = ({ code }) => {
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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
    console.log("logged out!");
  };
  const goToAUTH_URL = () => {
    window.location.replace(AUTH_URL);
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
          <NavbarContainer>
            <NavLogo to="/" onClick={closeMobileMenu}>

              <NavIcon />
              <Icon>
                  <img src={LogoBlack}  alt={"logo"}/>
              </Icon>
              {/* <SvgIcon>
    <img src={LogoWhite} alt=""  />
 </SvgIcon> */}
              
              {/* <Logo/> */}
              spotnfind
              {/* <img src={Logo} /> */}
            </NavLogo>
            {code ? (
              <>
                <MobileIcon onClick={handleClick}>
                  {click ? <FaTimes /> : <FaBars />}
                </MobileIcon>
                <NavMenu onClick={handleClick} click={click}>
                  <NavItem>
                    <NavLinks to="/" onClick={closeMobileMenu}>
                      Home
                    </NavLinks>
                  </NavItem>
                  <NavItem>
                    <NavLinks to="/playlists" onClick={closeMobileMenu}>
                      Playlists
                    </NavLinks>
                  </NavItem>
                  <NavItem>
                    <NavLinks to="/albums" onClick={closeMobileMenu}>
                      Albums
                    </NavLinks>
                  </NavItem>
                  <NavItem>
                    <NavLinks to="/likedSongs" onClick={closeMobileMenu}>
                      Liked Songs
                    </NavLinks>
                  </NavItem>{" "}
                  <NavItem>
                    <NavLinks to="/about" onClick={closeMobileMenu}>
                      About
                    </NavLinks>
                  </NavItem>
                  <NavItemBtn>
                    {/* <NavBtnLink to= "/"> */}
                    <Button onClick={logout} primary>
                      Log Out
                    </Button>
                    {/* </NavBtnLink> */}

                    {/* {button ? (
                  <NavBtnLink >
                    <Button onClick={logout} primary>
                      Log Out
                    </Button>
                  </NavBtnLink>
                ) : (
                  <NavBtnLink to="/">
                    <Button onClick={closeMobileMenu} fontBig primary>
                      Log Out
                    </Button>
                  </NavBtnLink>
                )} */}
                  </NavItemBtn>
                </NavMenu>
              </>
            ) : (
              <>
                <MobileIcon onClick={handleClick}>
                  {click ? <FaTimes /> : <FaBars />}
                </MobileIcon>
                <NavMenu onClick={handleClick} click={click}>
                  <NavItem>
                    <NavLinks to="/about" onClick={closeMobileMenu}>
                      About
                    </NavLinks>
                  </NavItem>

                  <NavBtnLink to="/">
                    <Button onClick={goToAUTH_URL} primary>
                      Log In
                    </Button>
                  </NavBtnLink>
                </NavMenu>
              </>
            )}
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default NavBar;
