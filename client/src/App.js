import React from "react";
import { useState, useEffect } from "react";

// import Dashboard from './Dashboard';
// import Login from './Login';
import Main from "./components/Main";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import useAuth from "./hooks/useAuth";

// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { Container } from './styles/App.styles';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NavBar from "./components/NavBar";
import About from "./pages/About";
// import Contact from "./pages/Contact";

import UserPlaylists from "./pages/UserPlaylists";
import PlaylistData from "./pages/PlaylistData";
import SongData from "./pages/SongData";

import { Card } from "react-bootstrap";
import LoginPage from "./components/LoginPage";

// export const AuthContext = React.createContext();
// const initialState = {
//   isAuthenticated: false,
//   token: null,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       localStorage.setItem("token", JSON.stringify(action.payload.token));
//       return {
//         ...state,
//         isAuthenticated: true,
//         token: action.payload.token,
//       };
//     case "LOGOUT":
//       localStorage.clear();
//       return {
//         ...state,
//         isAuthenticated: false,
//       };
//     default:
//       return state;
//   }
// };
const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  // const access_token = useAuth(code)
  console.log(`code: ${code}`);

  // const [state, dispatch] = React.useReducer(reducer, initialState);
  const [token, setToken] = useState();
  const [loggedIn, setLoggedIn] = useState(false);


  // useEffect(() => {
    // const token = JSON.parse(localStorage.getItem("token") || null);
    // if (token) {
    //   dispatch({
    //     type: "LOGIN",
    //     payload: {
    //       token,
    //     },
    //   });
    // }
  // }, []);
  return (
    <>
      <Router>
        {/* <AuthContext.Provider
        value={{
          state,
          dispatch,
        }}
      > */}
        <NavBar code = {code}/>
      {/* {console.log("show up??")} */}
        <div>
          {/* {console.log(state.isAuthenticated)} */}
          {code ? (
            /*if code is true, you are logged in*/
            <div>
              <Main code={code} />
              {/* <HomePage /> */}
            </div>
          ) : (
            /*if code is false, you are logged out*/
            <LoginPage />
          )}
        </div>

        <Footer />
      </Router>
      {/* </AuthContext.Provider> */}
    </>
  );
};
export default App;
