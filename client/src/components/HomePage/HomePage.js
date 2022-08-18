import React from "react";
import { Link } from "react-router-dom";
import { Container, Button } from "../../styles/globalStyles";
import {
  InfoSec,
  InfoRow,
  InfoColumn,
  TextWrapper,
  TopLine,
  Heading,
  Subtitle,
  ImgWrapper,
  Img,
} from "./HomePageStyle.js";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

const HomePage = () => {
  return (
    <>
    
      <InfoSec lightBg={false}>
        <Container>
          <InfoRow imgStart={""}>
            <InfoColumn>
              <TextWrapper>
                {/* <TopLine lightTopLine={true}>{"Welcome"}</TopLine> */}
                <Heading lightText={true}>{"Welcome!"}</Heading>
                <Subtitle lightTextDesc={true}>{"Browse your Spotify Playlists, Albums or Liked Songs to access musical information from your music"}</Subtitle>
                <Link to="/playlists">
                  <Button big fontBig primary={true}>
                    {"Playlists"}
                  </Button>
                </Link>
                <Link to="/albums">

                  <Button big fontBig primary={true}>
                    {"Albums"}
                  </Button>
                </Link>{" "}
                <Link to="/likedSongs">
                  <Button big fontBig primary={true}>
                    {"Liked Songs"}
                  </Button>
                </Link>
              </TextWrapper>
            </InfoColumn>
            <InfoColumn>
            
            </InfoColumn>
          </InfoRow>
        </Container>
      </InfoSec>
    </>
  );
};

export default HomePage;
