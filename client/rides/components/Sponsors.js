import React from "react";
import styled from "styled-components";

const Header = styled.h2`
  text-align: center;
  margin: 0;
  margin-top: 20px;
`;

const Sponsors = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  margin: 0 auto;
  max-width: 800px;
`;

const Sponsor = styled.li`
  display: flex;
  align-items: stretch;
`;

const Logo = styled.a`
  display: block;
  margin-right: 15px;
  width: 200px;
  flex-shrink: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 200px;

  ${props =>
    `background-image: url(${props.src})`
  }
`

const Description = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.4;
`;

export default ({ sponsors, label }) => (
  <div>
    <Header>{label}</Header>
    <Sponsors>
      {sponsors.map(sponsor => (
        <Sponsor sponsor={sponsor}>
          <Logo href={sponsor.website} src={sponsor.logo}></Logo>
          <Description>{sponsor.description}</Description>
        </Sponsor>
      ))}
    </Sponsors>
  </div>
);
