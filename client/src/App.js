import React from 'react';

// import Dashboard from './Dashboard';
// import Login from './Login';
import Main from "./components/Main";
import Login from "./components/Login";

// import { Container } from './styles/App.styles';

const App = () => {
  const code = new URLSearchParams(window.location.search).get('code');
  console.log(`code: ${code}`)
  return <div>{code ? <Main code={code} /> : <Login />}</div>;
};

export default App;
 