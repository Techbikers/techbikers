import React from "react";
import styled from "styled-components";

import AuthMenu from "techbikers/auth/containers/AuthMenu";

const FooterBlock = styled.footer`
  background-color: #392C3A;
  margin-top: 52px;
  padding: 130px 0;
  color: #F5EFEA;
`;

const Link = styled.a`
  &, &:hover {
    color: #FDEC18;
  }
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SocialLinks = styled.p`
  text-align: center;
`;

const Footer = () => (
  <FooterBlock>
    <div className="content">
      <FirstRow>
        <div>
          <Link href="mailto:hello@techbikers.com">hello@techbikers.com</Link>
          <br />
          4-5 Bonhill Street<br />London<br />EC2A 4BX
        </div>
        <AuthMenu />
      </FirstRow>

      <SocialLinks>
        <Link href="http://www.facebook.com/techbikers" target="_blank">
          Facebook
        </Link>
        {" "}
        ·
        {" "}
        <Link href="http://twitter.com/techbikers" target="_blank">
          Twitter
        </Link>
      </SocialLinks>
    </div>
  </FooterBlock>
);

export default Footer;
