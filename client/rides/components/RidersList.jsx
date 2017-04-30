import React, { PropTypes } from "react";
import styled from "styled-components";

import { UserShape } from "techbikers/users/shapes";

import RiderCard from "techbikers/users/components/RiderCard";

const Riders = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const List = styled.ul`
  margin: 20px 0;
  padding: 0;
  list-style: none;
  text-align: center;
`;

const RidersList = ({ riders }) => (
  <Riders>
    <div className="content">
      <h2>The Riders</h2>
      <List>
        {riders.map(rider =>
          <RiderCard key={rider.id} {...rider} />
        )}
      </List>
    </div>
  </Riders>
);

RidersList.propTypes = {
  riders: PropTypes.arrayOf(UserShape)
};

export default RidersList;
