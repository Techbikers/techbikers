import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { logout } from "techbikers/auth/actions";
import { getCurrentPathname } from "techbikers/app/selectors";
import { getAuthenticatedUserId } from "techbikers/auth/selectors";

const mapStateToProps = state => {
  const { state: authState } = state.auth;
  const isAuthenticated = authState === "authenticated";
  const pathname = getCurrentPathname(state);
  const userId = getAuthenticatedUserId(state);

  return { isAuthenticated, pathname, userId };
};

const mapDispatchToProps = {
  logout
};

@connect(mapStateToProps, mapDispatchToProps)
export default class AuthMenu extends Component {
  static propTypes = {
    pathname: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  render() {
    const { isAuthenticated, pathname, userId } = this.props;

    if (isAuthenticated) {
      return (
        <div className="span2">
          <a className="userAuth" onClick={() => this.props.logout()}>Log out</a>
          <Link to={`/riders/${userId}`} className="userAuth">Profile</Link>
        </div>
      );
    } else {
      return (
        <Link className="userAuth" to={{
          pathname: "/login",
          state: { modal: true, returnTo: pathname }
        }}>
          Login to Techbikers
        </Link>
      );
    }
  }
}
