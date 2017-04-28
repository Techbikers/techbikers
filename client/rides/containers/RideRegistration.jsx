import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { fetchRideRegistrationDetails } from "techbikers/rides/actions";
import {
  openRideRegistrationModal,
  closeRideRegistrationModal } from "techbikers/rides/actions/ui";
import { getAuthenticatedUser } from "techbikers/auth/selectors";
import { getRegistrationForCurrentRideAndUser } from "techbikers/rides/selectors";
import { getFundraiserForCurrentRideAndUser } from "techbikers/fundraisers/selectors";
import { getCurrentRide } from "techbikers/rides/selectors";
import { getChapterForCurrentRide } from "techbikers/chapters/selectors";
import { RideShape, RegistrationShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import RideRegistrationModal from "techbikers/rides/components/RideRegistrationModal";
import RegistrationSteps from "techbikers/rides/components/RegistrationSteps";
import SetupFundraising from "techbikers/fundraisers/containers/SetupFundraising";

const RideRegistrationDetails = styled.div`
  padding: 0 15px;
  border-bottom: 1px solid #e2e2e2;
`;

const RegistrationContainer = styled.div`
  margin: 40px auto;
  max-width: 420px;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
`;

const RegistrationPopdown = styled(RegistrationContainer)`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23);
`;

const Header = styled.header`
  display: inline-block;
  padding: 10px 40px;
  width: 100%;
  margin: 0;
  border: 3px solid #333;
  background: #333;

  ${props => props.roundedCorners ? `
    border-radius: 3px;
  ` : `
    border-radius: 3px 3px 0 0;
  `}
  text-align: center;
  font-size: 18px;
  line-height: 26px;
  vertical-align: middle;
  color: #fff;
`;

Header.propTypes = {
  roundedCorners: PropTypes.boolean
};


const mapStateToProps = state => {
  const { rideRegistrationModal } = state.ui.rides;
  const { errors } = state;

  return {
    ride: getCurrentRide(state),
    user: getAuthenticatedUser(state),
    chapter: getChapterForCurrentRide(state),
    registration: getRegistrationForCurrentRideAndUser(state),
    fundraiser: getFundraiserForCurrentRideAndUser(state),
    rideRegistrationModal,
    errors
  };
};

const mapDispatchToProps = {
  fetchRideRegistrationDetails,
  handleOpenModal: openRideRegistrationModal,
  handleCloseModal: closeRideRegistrationModal
};

@connect(mapStateToProps, mapDispatchToProps)
export default class RideRegistration extends Component {
  static propTypes = {
    ride: RideShape,
    user: UserShape,
    registration: RegistrationShape,
    fundraiser: FundraiserShape,
    rideRegistrationModal: PropTypes.bool,
    fetchRideRegistrationDetails: PropTypes.func.isRequired,
    handleOpenModal: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { user, ride } = this.props;

    if (user && ride) {
      this.props.fetchRideRegistrationDetails(ride.id, user.id);
    }
  }

  componentWillUpdate(nextProps) {
    const { user: prevUser } = this.props;
    const { user, ride } = nextProps;

    if (!prevUser && user) {
      // The user has just logged in so we should fetch
      // the registration record (if it exists)
      this.props.fetchRideRegistrationDetails(ride.id, user.id);
    }
  }

  renderRideFull() {
    return (
      <RegistrationContainer>
        <Header roundedCorners={true}>Now sold out</Header>
        <span className="more-info">
          Registration for this ride has closed as it is now sold out
        </span>
      </RegistrationContainer>
    );
  }

  renderPendingRegistration() {
    return (
      <RegistrationPopdown>
        <Header>Waiting for invite...</Header>
        <div>
          <RegistrationSteps step={2} state="pending" />
          <RideRegistrationDetails>
            <p>
              We've received your application to join this ride. You'll hear from us soon
              so in the meantime, why not jump on your bike and go for a ride?
            </p>
          </RideRegistrationDetails>
        </div>
      </RegistrationPopdown>
    );
  }

  renderExpiredRegistration() {
    return (
      <RegistrationPopdown>
        <Header>Invite Expired</Header>
        <div>
          <RegistrationSteps step={3} state="failed"/>
          <RideRegistrationDetails>
            <p>
              Unfortunately your invite to register for this ride has now expired. Demand for our rides
              is always high so if you fail to accept the invite to register for the ride then we give
              your spot to someone else on the waiting list.
            </p>
          </RideRegistrationDetails>
        </div>
      </RegistrationPopdown>
    );
  }

  renderRejectedRegistration() {
    return (
      <RegistrationPopdown>
        <Header>No invite</Header>
        <div>
          <RegistrationSteps step={2} state="failed"/>
          <RideRegistrationDetails>
            <p>
              Due to exceptional demand we've been unable to invite you to join the ride.
              Sorry if this is a disappointing outcome but we hope you'll apply to join
              another Techbikers ride in the future!
            </p>
          </RideRegistrationDetails>
        </div>
      </RegistrationPopdown>
    );
  }

  renderCompleteRegistration() {
    const { user } = this.props;

    return (
      <RegistrationPopdown>
        <Header>You've been invited to join!</Header>
        <div>
          <RegistrationSteps step={3} state="pending"/>
          <RideRegistrationDetails>
            <p>
              Good news, {user.first_name} - you've been invited to join the ride. You now need to confirm
              and pay the registration fee before your invite expires.
            </p>
          </RideRegistrationDetails>
          <a className="btn btn-green btn-full" onClick={() => this.props.handleOpenModal()}>Complete Registration</a>
        </div>
      </RegistrationPopdown>
    );
  }

  renderCompletedRegistration() {
    return (
      <RegistrationPopdown>
        <Header>You're signed up for the ride!</Header>
        <div>
          <RegistrationSteps step={4}/>
          <RideRegistrationDetails>
            <p>
              <SetupFundraising {...this.props} />
            </p>
          </RideRegistrationDetails>
        </div>
      </RegistrationPopdown>
    );
  }

  renderStartRegistration() {
    return (
      <RegistrationContainer>
        <a className="btn btn-green btn-full" onClick={() => this.props.handleOpenModal()}>Sign up for the ride!</a>
      </RegistrationContainer>
    );
  }

  renderContent() {
    const { ride, registration } = this.props;

    if (ride.spaces_left < 1) {
      // Registration is closed as there are no more spaces on the ride
      // (doesn't matter if the ride requires pre-registration)
      return this.renderRideFull();
    }

    if (registration) {
      const { status, expired } = registration;

      switch (status) {
        case "PEN":
          // The logged in rider has a pending registration for this ride.
          // This means they are waiting to be accepted so they can then
          // complete their registration.
          return this.renderPendingRegistration();

        case "ACC":
          // The current rider has been accepted onto the ride. If their invite
          // to register hasn't expired then show them a form to complete signup.
          if (expired) {
            return this.renderExpiredRegistration();
          }

          return this.renderCompleteRegistration();

        case "REG":
          // The logged in rider has already signed up for the ride and
          // is confirmed as fully registered. No need to do anything
          // but get on that bike and train!
          return this.renderCompletedRegistration();

        case "REJ":
          return this.renderRejectedRegistration();
        default:
          return null;
      }
    } else {
      return this.renderStartRegistration();
    }
  }

  render() {
    const { ride, registration, rideRegistrationModal, fundraiser, handleCloseModal } = this.props;

    if (ride && ride.is_over) {
      return null;
    }

    return (
      <section>
        {this.renderContent()}

        {rideRegistrationModal &&
          <RideRegistrationModal
            isOpen={rideRegistrationModal}
            registrationStatus={registration && registration.status}
            hasFundraiser={!!fundraiser}
            onRequestClose={handleCloseModal} />
        }
      </section>
    );
  }
}
