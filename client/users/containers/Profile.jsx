import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import { fetchUserById } from "techbikers/users/actions";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";
import { getCurrentUser, getRidesForCurrentUser } from "techbikers/users/selectors";
import { UserShape } from "techbikers/users/shapes";
import { yellow } from "techbikers/utils/style-variables";

import Button from "techbikers/components/Button";
import Avatar from "techbikers/users/components/Avatar";
import UserRidesList from "techbikers/users/containers/UserRidesList";
import TwitterLink from "techbikers/components/TwitterLink";
import Spinner from "techbikers/components/Spinner";
import Content from "techbikers/app/components/Content";

const Toolbar = styled.section`
  background: ${yellow};
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
`;

const Rides = styled.section`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background: #f5f5f5;
`;

const RidesHeader = styled.h2`
  text-align: center;
`;

const mapStateToProps = (state, ownProps) => ({
  user: getCurrentUser(state),
  rides: getRidesForCurrentUser(state),
  canEdit: Number(ownProps.params.id) === getAuthenticatedUserId(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchUser: () => dispatch(fetchUserById(props.params.id))
});

@connect(mapStateToProps, mapDispatchToProps)
export default class RiderProfile extends Component {
  static propTypes = {
    canEdit: PropTypes.bool,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    user: UserShape,
    fetchUser: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchUser();
  }

  render() {
    const { user, canEdit } = this.props;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`${user.name} – Techbikers`}>
        <div id="rider-profile">
          <section id="header">
            <header className="centerText">
              <Avatar {...user} size={130} rounded />
              <h1>{user.name}</h1>
              <h3>{user.company} |
                  {user.website} |
                <TwitterLink handle={user.twitter} /></h3>
              {canEdit ?
                <Button type="link" to="/account">Edit Profile</Button> : ""}
            </header>

            {user.donationPage &&
              <div className="content text--centre">
                <p>
                  <Button type="a" href={user.donationPage}>Sponsor {user.firstName}</Button>
                </p>
              </div>}
          </section>

          <section id="description">
            <div className="content centerText">
              <p>{user.biography}</p>

              {user.statement !== "" ?
                <h2>Why am I doing Techbikers?</h2> : ""}

              <p>{user.statement}</p>
            </div>
          </section>

          <Rides>
            <Content>
              <RidesHeader>{user.firstName}'s rides:</RidesHeader>
              <UserRidesList userId={user.id} />
            </Content>
          </Rides>
        </div>
      </DocumentTitle>
    );
  }
}
