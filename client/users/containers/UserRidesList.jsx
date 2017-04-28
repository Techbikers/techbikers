import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import styled from "styled-components";

import { getRidesForCurrentUser } from "techbikers/users/selectors";
import { fetchRidesByUser } from "techbikers/rides/actions";
import { RideShape } from "techbikers/rides/shapes";

import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  rides: getRidesForCurrentUser(state)
});

const mapDispatchToProps = {
  fetchRidesByUser
};

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

@connect(mapStateToProps, mapDispatchToProps)
export default class UserRidesList extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    rides: PropTypes.arrayOf(RideShape),
    fetchRidesByUser: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { userId } = this.props;
    this.props.fetchRidesByUser(userId);
  }

  render() {
    const { rides } = this.props;

    if (!rides) {
      return <Spinner />;
    }

    if (rides.length === 0) {
      return <span>This user has not signed up for any rides yet</span>;
    }

    return (
      <List>
        {rides.map(ride =>
          <li key={ride.id}><Link to={`/rides/${ride.id}/${ride.slug}`}>{ride.name}</Link></li>
        )}
      </List>
    );
  }
}
