import React from "react";
import styled from "styled-components";

const Header = styled.h2`
  text-align: center;
  margin: 0;
  margin-top: 10px;
`;

const Sponsors = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const Logo = styled.img`
  display: block;
`

export default ({ sponsors, label, size }) => (
  <div>
    <Header>{label}</Header>
    <Sponsors>
      {sponsors.map(sponsor => (
        <li sponsor={sponsor}>
          <Logo src={sponsor.logo} height={size} />
        </li>
      ))}
    </Sponsors>
  </div>
);
