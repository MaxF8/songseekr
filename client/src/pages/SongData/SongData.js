import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useLocation} from "react-router-dom"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"



const SongData = (props) => {
  const location = useLocation();
  const state = location.state;
  // const playlistID = state.id
    return (
        <>  
          <div>song data!!!</div>
        </>
    )
}
export default SongData
