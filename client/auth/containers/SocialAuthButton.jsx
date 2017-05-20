import React, { PropTypes } from "react";
import { connect } from "react-redux";

import { authenticateSocialUser } from "techbikers/auth/actions";
import Button from "techbikers/components/Button";

const mapDispatchToProps = (dispatch, props) => {
  const { connection, callbackReturnTo, callbackAction } = props;

  return {
    handleSocialAuth: () => dispatch(
      authenticateSocialUser(connection, callbackReturnTo, callbackAction)
    )
  };
};

const SocialAuthButton = ({ connection, children, handleSocialAuth }) => (
  <Button type="submit" onClick={() => handleSocialAuth()}>
    {children || `Login with ${connection}`}
  </Button>
);

SocialAuthButton.propTypes = {
  connection: PropTypes.string,
  callbackReturnTo: PropTypes.string,
  callbackAction: PropTypes.shape({
    type: PropTypes.string,
    payload: PropTypes.any
  }),
  children: PropTypes.node,
  handleSocialAuth: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SocialAuthButton);
