import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";

import { getAuthenticatedUser, getAuthenticatedUserId } from "techbikers/auth/selectors";
import { fetchUserById } from "techbikers/users/actions";
import { updateCurrentEntity } from "techbikers/app/actions";
import { UserShape } from "techbikers/users/shapes";

import requireAuthentication from "techbikers/auth/containers/requireAuthentication";
import UserRidesList from "techbikers/users/containers/UserRidesList";
import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  id: getAuthenticatedUserId(state),
  user: getAuthenticatedUser(state)
});

const mapDispatchToProps = {
  fetchUserById,
  updateCurrentEntity
};

@requireAuthentication()
@connect(mapStateToProps, mapDispatchToProps)
export default class Account extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    user: UserShape,
    fetchUserById: PropTypes.func.isRequired,
    updateCurrentEntity: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { id } = this.props;
    this.props.fetchUserById(id);
    this.props.updateCurrentEntity({ id });
  }

  render() {
    const { id, user } = this.props;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title="My Account – Techbikers">
        <section>
          <div className="content text--centre">
            <header>
              <h1>Hi {user.firstName}!</h1>
            </header>

            <ul className="list-unstyled">
              <li>Change your password</li>
            </ul>

            <div className="current-rides">
              <h2>Your upcoming rides:</h2>
              <UserRidesList userId={id} />
            </div>

          </div>
        </section>
      </DocumentTitle>
    );
  }
}
