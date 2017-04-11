import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import Modal from "techbikers/components/Modal";
import { authenticateAs, closeAuthModal } from "techbikers/auth/actions";
import LoginForm from "techbikers/auth/components/LoginForm";

const mapStateToProps = state => ({
  authModalOpen: state.page.ui
});

const mapDispatchToProps = dispatch => ({
  closeAuthModal: () => dispatch(closeAuthModal()),
  handleAuthentication: (email, password) => dispatch(authenticateAs(email, password))
});

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginModal extends Component {
  static propTypes = {
    authModalOpen: PropTypes.bool,
    closeAuthModal: PropTypes.func.isRequired,
    handleAuthentication: PropTypes.func.isRequired
  };

  render() {
    const { authModalOpen, ...props } = this.props;

    return (
      <Modal isOpen={authModalOpen} onRequestClose={() => this.props.closeAuthModal()} {...props}>
        <section id="login">
          <header>
            <h1>Login</h1>
          </header>
          <div className="content">
            <LoginForm onSubmit={this.props.handleAuthentication} />
          </div>
        </section>
      </Modal>
    );
  }
}
