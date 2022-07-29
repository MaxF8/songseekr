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

const HomePage = () => {
  return (
    <>
      <InfoSec lightBg={false}>
        <Container>
          <InfoRow imgStart={""}>
            <InfoColumn>
              <TextWrapper>
                <TopLine lightTopLine={true}>{"Exclusive Access"}</TopLine>
                <Heading lightText={true}>{"Exclusive Access"}</Heading>
                <Subtitle lightTextDesc={true}>{"Exclusive Access"}</Subtitle>
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
              {/* <ImgWrapper start={start}>
                <Img src={img} alt={alt} />
              </ImgWrapper> */}
            </InfoColumn>
          </InfoRow>
        </Container>
      </InfoSec>
    </>
  );
};

export default HomePage;
