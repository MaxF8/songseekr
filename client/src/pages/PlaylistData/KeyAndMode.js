import React, { useState, useEffect } from 'react';
import axios from 'axios'
import {useLocation} from "react-router-dom"
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"

const numberToLetterConverter = {
    "0": "C",
    "1": "C#",
    "2": "D",
    "3": "D#",
    "4": "E",
    "5": "F",
    "6": "F#",
    "7": "G",
    "8": "G#",
    "9": "A",
    "10": "A#",
    "11": "B",
}
const minorOrMajor = {
    "0": "Minor",
    "1": "Major",
}


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
         {props.isKeyTrue ? <>{numberToLetterConverter[data.key]}</>: <>{minorOrMajor[data.mode]}</>}
        </>
    )
}

export default KeyAndMode