import React, { PropTypes } from "react";
import styled from "styled-components";

import Notification from "techbikers/notifications/components/Notification";
import { errorColor } from "techbikers/utils/style-variables";

const Root = styled(Notification)`
  ${props => props.type === "text" ? `
    background-color: #fff;
  ` : ""}

  ${props => props.type === "error" ? `
    color: #fff;
    background-color: ${errorColor}
  ` : ""}
`;

Root.propTypes = {
  type: PropTypes.string
};

const TextNotification = ({ text, type = "text" }) => (
  <Root type={type}>{text}</Root>
);

TextNotification.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default TextNotification;
