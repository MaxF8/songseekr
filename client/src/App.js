import React from "react";
import { useState } from "react";

import Main from "./components/Main";
import Footer from "./components/Footer";

import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "./components/NavBar";

import LoginPage from "./components/LoginPage";

const App = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  // const access_token = useAuth(code)
  console.log(`code: ${code}`);

  // const [state, dispatch] = React.useReducer(reducer, initialState);
  const [token, setToken] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <NavBar code={code} />
        <div>
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
    </>
  );
};
export default App;
