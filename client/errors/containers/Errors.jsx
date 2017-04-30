import React, { PropTypes } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { ErrorShape } from "techbikers/errors/shapes";
import { errorColor } from "techbikers/utils/style-variables";

const mapStateToProps = (state, props) => ({
  error: state.errors[props.errorKey]
});

const Root = styled.div`
  display: flex;
  justify-content: center;
`;

const Error = styled.div`
  padding: 8px 16px;
  margin: 16px;
  background-color: ${errorColor};
  border-radius: 4px;
  text-align: center;

  ${props => props.full ? `
    flex-grow: 1;
  ` : ""}

`;

const Errors = ({ error, full }) => {
  if (!error) {
    return null;
  }

  return (
    <Root>
      <Error full={full}>
        {error.message}
      </Error>
    </Root>
  );
};

Errors.propTypes = {
  error: ErrorShape,
  full: PropTypes.bool
};

export default connect(mapStateToProps)(Errors);
