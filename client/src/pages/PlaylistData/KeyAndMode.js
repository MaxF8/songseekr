import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useLocation} from "react-router-dom"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"




const KeyAndMode = (props) =>
{
    console.log(props)
    const [token, setToken] = useState("");
    const [data, setData] = useState({});
    // const [id, setID] = useState("");

    const id = props.id;
    const SONG_FEATURES_ENDPOINT = `https://api.spotify.com/v1/audio-features/${id}`;
    useEffect(() => {
        console.log(props)
        // console.log(`id: ${id}`);
        setToken(localStorage.getItem("access_token"));
        console.log(`token (song features): ${token}`)

        axios
        .get(SONG_FEATURES_ENDPOINT, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json"
        },
        })
        .then((response) => {
        console.log("song feature data")
        console.log(response.data)

        // let result = response.data
        // //   console.log(Object.keys(result[0].track))
        // for (let x in result)  
        // {
        //     console.log(result[x].audio_features)
        // }
        // console.log("playlist data: "+JSON.stringify(response.data))

        setData(response.data);
        })  
        .catch((error) => {   
        console.log(error);
        });

    }, [token,id]); //data????


    return(
        <>
         {props.isKeyTrue ? <>{data.key}</>: <>{data.mode}</>}
        
        </>
    )
}

export default KeyAndMode