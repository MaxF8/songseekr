import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useLocation} from "react-router-dom"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"




const SongData = () => {
  const location = useLocation();
  const state = location.state;
  console.log(state);
  // const playlistID = state.id
    return (
        <>  
          <div>Song: {state.track.name}</div>
        </>
    )
}
export default SongData
