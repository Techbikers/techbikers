import React, { PropTypes } from "react";

import Modal from "techbikers/components/Modal";
import requireAuthentication from "techbikers/auth/containers/requireAuthentication";

import SetupFundraising from "techbikers/fundraisers/containers/SetupFundraising";
import ConnectedPreRegistrationForm from "techbikers/rides/containers/ConnectedPreRegistrationForm";
import ConnectedCompleteRegistration from "techbikers/rides/containers/ConnectedCompleteRegistration";
import CloseRideRegistrationModalButton from "techbikers/rides/containers/CloseRideRegistrationModalButton";

const PendingRegistration = () => (
  <div>
    <p>
      Awesome - we've received your application to join this ride. You'll hear from us soon
      so in the meantime, why not jump on your bike and go for a ride.
    </p>
    <CloseRideRegistrationModalButton kind="positive">Great!</CloseRideRegistrationModalButton>
  </div>
);

const FullyRegistered = () => (
  <div>
    <p>
      Nice work - that's all from us. On your bike and let's change lives!
    </p>
    <CloseRideRegistrationModalButton>OK!</CloseRideRegistrationModalButton>
  </div>
);

const CreateFundraiser = () => (
  <div>
    <p>
      You're all set! You've completed registration and we've received payment - all that's left
      to do now is to setup your fundraising page and train!
    </p>
    <SetupFundraising />
    <CloseRideRegistrationModalButton>Not right now</CloseRideRegistrationModalButton>
  </div>
);

const RideRegistrationModalContents = ({ status, hasFundraiser }) => {
  switch (status) {
    case "ACC":
      return <ConnectedCompleteRegistration />;
    case "PEN":
      return <PendingRegistration />;
    case "REG":
      if (!hasFundraiser) {
        return <CreateFundraiser />;
      } else {
        return <FullyRegistered />;
      }
    default:
      return <ConnectedPreRegistrationForm />;
  }
};

RideRegistrationModalContents.propTypes = {
  status: PropTypes.string,
  hasFundraiser: PropTypes.bool
};

const RideRegistrationModal = ({ isOpen = false, registrationStatus, hasFundraiser, onRequestClose }) => (
  <Modal isOpen={isOpen} onRequestClose={() => onRequestClose()}>
    <RideRegistrationModalContents status={registrationStatus} hasFundraiser={hasFundraiser}/>
  </Modal>
);

RideRegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  registrationStatus: PropTypes.string,
  hasFundraiser: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired
};

export default requireAuthentication()(RideRegistrationModal);
