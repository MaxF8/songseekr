import React from 'react';

// import Dashboard from './Dashboard';
// import Login from './Login';
import Main from "./components/Main";
import Login from "./components/Login";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import { Container } from './styles/App.styles';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import NavBar from "./components/NavBar"

const App = () => {
  const code = new URLSearchParams(window.location.search).get('code');

  console.log(`code: ${code}`)
  return (
    <Router>
      <NavBar/>
      <div>{code ? (<div>
        <Main code={code} /> 
        {/* <div>d</div> */}
        </div>
      )
      
      : <Login />}</div>
   
    </Router>
  )
 
};
export default App;
 