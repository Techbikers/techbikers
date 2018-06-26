import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import { RideShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { getCurrentRide } from "techbikers/rides/selectors";
import { getUsersOnCurrentRide } from "techbikers/users/selectors";
import { fetchUsersByRide } from "techbikers/users/actions";

import Spinner from "techbikers/components/Spinner";
import RidersList from "techbikers/rides/components/RidersList";

import { getLeaderboard } from "techbikers/fundraisers/selectors";
import { fetchActiveFundraisers } from "techbikers/fundraisers/actions";

const RidersWrapper = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const mapStateToProps = state => ({
  ride: getCurrentRide(state),
  riders: getUsersOnCurrentRide(state),
  fundraisers: getLeaderboard(state)
});

const mapDispatchToProps = {
  fetchUsersByRide,
  fetchActiveFundraisers
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class ConnectedRidersList extends Component {
  static propTypes = {
    ride: RideShape,
    riders: PropTypes.arrayOf(UserShape),
    fetchUsersByRide: PropTypes.func.isRequired,
    fundraisers: PropTypes.arrayOf(FundraiserShape),
    fetchActiveFundraisers: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchUsersByRide(this.props.ride.id);
  }

  render() {
    const { riders, fundraisers } = this.props;

    const fundraisersById = fundraisers.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});

    const mappedRiders = riders.slice().map(rider => {
      const fundraiserId = rider.fundraisers[rider.fundraisers.length - 1];
      rider.latestFundraiser = fundraisersById[fundraiserId];
      return rider;
    });

    mappedRiders.sort((riderA, riderB) => {
      const a = riderA.latestFundraiser;
      const b = riderB.latestFundraiser;
      return ((a ? a.totalRaised : null) < (b ? b.totalRaised : null)) ? 1 : -1;
    });

    return (
      <RidersWrapper>
        <div className="content">
          <h2>The Riders</h2>
          {mappedRiders.length === 0 ? (
            <Spinner spacing="20px" />
          ) : (
            <RidersList riders={mappedRiders} />
          )}
        </div>
      </RidersWrapper>
    );
  }
}
