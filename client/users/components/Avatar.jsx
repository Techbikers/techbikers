import React, { PropTypes } from "react";
import styled from "styled-components";

const RiderAvatar = styled.div`
  position: absolute;
  left: 60px;
`;

const Avatar = ({ name, avatar, size = 80 }) => (
  <RiderAvatar>
    <img title={name} src={`${avatar}?s=${size}`} width={size} height={size} />
  </RiderAvatar>
);

Avatar.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  size: PropTypes.number
};

export default Avatar;
