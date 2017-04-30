import React, { PropTypes } from "react";
import { Link } from "react-router";
import styled from "styled-components";

import Avatar from "techbikers/users/components/Avatar";

const Rider = styled.li`
  margin: 5px;
  padding: 0;
  list-style: none;
  position: relative;
  display: inline-block;
  opacity: 0.7;
  cursor: pointer;

  h4 {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    background: white;
    padding-left: 75px;
    padding-right: 15px;
    z-index: 2;
    text-align: left;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
    white-space: nowrap;
    margin: 0;
    line-height: 60px;
  }

  img {
    display: block;
    position: relative;
    float: left;
  }

  &:hover {
    opacity: 1;

    h4 {
      display: block;
    }

    img {
      z-index: 5;
    }
  }
`;

const RiderCard = ({ id, name, avatar, size = 60 }) => (
  <Rider>
    <Link to={`/riders/${id}`}>
      <Avatar name={name} avatar={avatar} size={size} />
      <h4>{name}</h4>
    </Link>
  </Rider>
);

RiderCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  avatar: PropTypes.string,
  size: PropTypes.number
};

export default RiderCard;
