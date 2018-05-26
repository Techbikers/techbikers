import React, { PropTypes } from "react";
import { connect } from "react-redux";

import { getCurrentEntity } from "techbikers/app/selectors";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";
import { FundraiserShape } from "techbikers/fundraisers/shapes";
import { CREATE_FUNDRAISER } from "techbikers/fundraisers/actions";
import { getFundraiserForCurrentRideAndUser } from "techbikers/fundraisers/selectors";

import Button from "techbikers/components/Button";
import SocialAuthButton from "techbikers/auth/containers/SocialAuthButton";

const mapStateToProps = state => {
  const rideId = getCurrentEntity(state)["id"];
  const userId = getAuthenticatedUserId(state);

  return {
    fundraiser: getFundraiserForCurrentRideAndUser(state),
    // This is the action that we want to fire as the auth callback
    callbackAction: {
      type: CREATE_FUNDRAISER,
      payload: { rideId, userId }
    }
  };
};

const SetupFundraising = ({ fundraiser, callbackAction }) => {
  if (fundraiser) {
    return (
      <Button type="a" href={fundraiser.pageUrl}>
        Go to my fundraising page
      </Button>
    );
  } else {
    return (
      <SocialAuthButton connection="JustGiving" callbackAction={callbackAction}>
        Create Fundraising Page
      </SocialAuthButton>
    );
  }
};

SetupFundraising.propTypes = {
  fundraiser: FundraiserShape,
  callbackAction: PropTypes.shape({
    type: PropTypes.string,
    payload: PropTypes.shape({
      rideId: PropTypes.number,
      userId: PropTypes.number
    })
  })
};

export default connect(mapStateToProps)(SetupFundraising);
