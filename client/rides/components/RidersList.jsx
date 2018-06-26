import React, { PropTypes } from "react";
import styled from "styled-components";

import { UserShape } from "techbikers/users/shapes";

import RiderCard from "techbikers/users/components/RiderCard";

const List = styled.ul`
  margin: 20px 0px!important;
  padding: 0;
  list-style: none;
  text-align: center;
`;

const RidersList = ({ riders }) => (
  <List>
    {riders.map(rider =>
      <RiderCard key={rider.id} {...rider} />
    )}
  </List>
);

RidersList.propTypes = {
  riders: PropTypes.arrayOf(UserShape)
};

export default RidersList;
