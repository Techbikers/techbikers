import React, { PropTypes } from "react";
import styled, { keyframes } from "styled-components";

import { green, purple } from "techbikers/utils/style-variables";

const Root = styled.div`
  margin: 100px auto;
  max-width: 200px;

  ${props => props.noMargin ? `
    margin: -3px 0;
  ` : ""}
`;

Root.propTypes = {
  noMargin: PropTypes.bool
};

const Loader = styled.div`
  margin: 0 auto;
  width: 1em;
  height: 1em;
  position: relative;
  font-size: ${props => props.size}px;
`;

const cubemove = keyframes`
  25% {
    transform: translateX(0.65em) rotate(-90deg) scale(0.5);
  } 50% {
    transform: translateX(0.65em) translateY(0.65em) rotate(-179deg);
  } 50.1% {
    transform: translateX(0.65em) translateY(0.65em) rotate(-180deg);
  } 75% {
    transform: translateX(0px) translateY(0.65em) rotate(-270deg) scale(0.5);
  } 100% {
    transform: rotate(-360deg);
  }
`;

const Cube = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.35em;
  height: 0.35em;
  animation: ${cubemove} 1.8s infinite ease-in-out;
`;

const Cube1 = styled(Cube)`
  background-color: ${green};

  ${props => props.light ? `
    background-color: #FFFFFF;
  ` : ""}
`;

Cube1.propTypes = {
  light: PropTypes.bool
};

const Cube2 = styled(Cube)`
  background-color: ${purple};
  animation-delay: -0.9s;

  ${props => props.light ? `
    background-color: #FFFFFF;
  ` : ""}
`;

Cube2.propTypes = {
  light: PropTypes.bool
};

const Message = styled.div`
  margin: 10px 0;
  text-align: center;
`;

const Spinner = ({ size = 56, light = false, noMargin = false, children }) => (
  <Root noMargin={noMargin}>
    <Loader size={size}>
      <Cube1 light={light} />
      <Cube2 light={light} />
    </Loader>
    {children && <Message>{children}</Message>}
  </Root>
);

Spinner.propTypes = {
  size: PropTypes.number,
  light: PropTypes.bool,
  noMargin: PropTypes.bool,
  children: PropTypes.node
};

export default Spinner;
