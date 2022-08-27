import React from 'react'


import { Button } from '../../styles/globalStyles';

import {
  FaInstagram,
  FaGithub,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';
import {
  LogoIcon,
  FooterContainer,
  FooterSubscription,
  FooterSubText,
  FooterSubHeading,
  Form,
  FormInput,
  FooterLinksContainer,
  FooterLinksWrapper,
  FooterLinkItems,
  FooterLinkTitle,
  FooterLink,
  SocialMedia,
  SocialMediaWrap,
  SocialLogo,
  SocialIcon,
  WebsiteRights,
  SocialIcons,
  SocialIconLink
} from './FooterStyle';

const Footer  = () => {
    

  return  (
      <FooterContainer>
      
        <SocialMedia>
          <SocialMediaWrap>
            <SocialLogo to='/'>
              <LogoIcon />
              spotnfind
            </SocialLogo>
            <SocialIcons>
              <SocialIconLink href='/' target='_blank' aria-label='Github'>
                <FaGithub />
              </SocialIconLink>
              <SocialIconLink href='/' target='_blank' aria-label='Instagram'>
                <FaInstagram />
              </SocialIconLink>
            
              <SocialIconLink href='/' target='_blank' aria-label='Twitter'>
                <FaTwitter />
              </SocialIconLink>
              <SocialIconLink href='/' target='_blank' aria-label='LinkedIn'>
                <FaLinkedin />
              </SocialIconLink>
            </SocialIcons>
          </SocialMediaWrap>
        </SocialMedia>
      </FooterContainer>
    );
  
}




export default Footer;
