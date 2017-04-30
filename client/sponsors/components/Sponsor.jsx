import React from "react";
import styled from "styled-components";

import { SponsorShape } from "techbikers/sponsors/shapes";

const Media = styled.div`
  overflow: hidden;
  zoom: 1;
`;

const Bd = styled.div`
  overflow: hidden;
  zoom: 1;
`;

const ImageLink = styled.a`
  float:left;
  margin-right: 20px;
`;

const Image = styled.img`
  display: block;
`;

const Sponsor = ({ sponsor }) => (
  <Media>
    <ImageLink href={sponsor.website} target="_blank">
      <Image src={sponsor.logo} alt={sponsor.organization} />
    </ImageLink>
    <Bd>
      <h3><a href={sponsor.website} target="_blank">{sponsor.organization}</a></h3>
      <p>
        {sponsor.description}
        <br/>
        <a href={sponsor.facebook}>Facebook</a> | <a href={sponsor.twitter}>Twitter</a>
      </p>
    </Bd>
  </Media>
);

Sponsor.propTypes = {
  sponsor: SponsorShape
};

export default Sponsor;
