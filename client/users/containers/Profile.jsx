import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";

import { fetchUserById } from "techbikers/users/actions";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";
import { getCurrentUser, getRidesForCurrentUser } from "techbikers/users/selectors";
import { UserShape } from "techbikers/users/shapes";

import Avatar from "techbikers/users/components/Avatar";
import UserRidesList from "techbikers/users/containers/UserRidesList";
import TwitterLink from "techbikers/components/TwitterLink";
import Spinner from "techbikers/components/Spinner";

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

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  render() {
    const { user, canEdit, params } = this.props;
    const { isEditing } = this.state;

    if (!user) {
      return <Spinner />;
    }

    return (
      <DocumentTitle title={`${user.name} – Techbikers`}>
        <div id="rider-profile">
          {isEditing ?
            <section className="toolbar">
              <button className="btn" type="submit">Save Changes</button>
              <button className="btn">Cancel</button>
            </section> : ""}

          <section id="header">
            <header className="centerText">
              <Avatar {...user} size="130" rounded />
              <h1>{user.name}</h1>
              <h3>{user.company} |
                  {user.website} |
                <TwitterLink handle={user.twitter} /></h3>
              {canEdit ?
                <Link className="btn" to={`/account`}>Edit Profile</Link> : ""}
            </header>

            <div className="content text--centre">
              <p>
                <a className="btn" href={user.donationPage}>Sponsor {user.firstName}</a>
              </p>
            </div>
          </section>

          <section id="description">
            <div className="content centerText">
              <p>{user.biography}</p>

              {isEditing || user.statement !== "" ?
                <h2>Why am I doing Techbikers?</h2> : ""}

              <p>{user.statement}</p>
            </div>
          </section>

          <section id="rides">
            <div className="content centerText">
              <h2>{`${user.firstName}'s rides:`}</h2>
              <UserRidesList userId={params.id} />
            </div>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
