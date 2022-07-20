import React, { useState, useEffect } from 'react';

import useAuth from './hooks/useAuth';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
import {
  DashBoardContainer,
  SearchInput,
  ResultsContainer,
  LyricsContainer,
  PlayerContainer,
} from './styles/Dashboard.styles';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState('');

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch('');
    setLyrics('');
  }

  useEffect(() => { //if we are playing a track get the lyrics
    if (!playingTrack) return;

    (async () => {
      const {
        data: { lyrics },
      } = await axios.get(`${process.env.REACT_APP_BASE_URL}/lyrics`, {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      });
      setLyrics(lyrics);
    })();
  }, [playingTrack]);

  useEffect(() => {  //if accessToken in null, return, else set accessToken for spotifyApi
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
   
  }, [accessToken]);

  useEffect(() => { 
    if (!search) return setSearchResults([]);//if nothing has been searched, return
    if (!accessToken) return;//if access token null, return
    console.log(spotifyApi.getU)
    let cancel = false;
    (async () => {
      const { body } = await spotifyApi.searchTracks(search);
      if (cancel) return;
      setSearchResults(
        body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    })();

    return () => (cancel = true);
  }, [search, accessToken]);

//
  useEffect(() => { 
  
    if (!accessToken) return;//if access token null, return

    spotifyApi.getUserPlaylists("yn55rwj9gdlyo3xp867l1s4g3")
    .then(function(data) {
      console.log('Retrieved playlists', data.body);
    },function(err) {
      console.log('Something went wrong!', err);
    });

  }, );


  return (
    <DashBoardContainer>
      <SearchInput
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ResultsContainer>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <LyricsContainer>{lyrics}</LyricsContainer>
        )}
      </ResultsContainer>
      <PlayerContainer>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </PlayerContainer>
    </DashBoardContainer>
  );
};

export default Dashboard;
