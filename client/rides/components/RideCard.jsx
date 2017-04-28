import React, { PropTypes } from "react";
import { Link } from "react-router";
import styled from "styled-components";

import Timestamp from "techbikers/components/Timestamp";

const CardLink = styled(Link)`
  display: inline-block;
  overflow: hidden;
  border: 2px solid #cccccc;
  border-radius: 5px;
  width: 360px;
  margin-bottom: 20px;
  transition: border ease 0.3s;
  list-style: none;
  position: relative;

  &:hover {
    border-color: #4494c7;
    text-decoration: none;
  }
`;

const Header = styled.header`
  padding: 10px;
`;

const Name = styled.h2`
  margin: 0;
`;

const Time = styled.h4`
  margin: 0;
`;

const RideCard = ({ id, name, slug, startDate, endDate }) => (
  <CardLink to={`/rides/${id}/${slug}`}>
    <Header>
      <Name>{name}</Name>
      <Time>
        <Timestamp value={startDate} format="D MMM" />
        {" "}
        to
        {" "}
        <Timestamp value={endDate} format="D MMM YYYY" />
      </Time>
    </Header>
  </CardLink>
);

RideCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  slug: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string
};

export default RideCard;
