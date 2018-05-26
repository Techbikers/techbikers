import React, { PropTypes } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { closeRideRegistrationModal } from "techbikers/rides/actions/ui";
import Button from "techbikers/components/Button";

const mapDispatchToProps = {
  onClick: closeRideRegistrationModal
};

export default connect(null, mapDispatchToProps)(Button);
