import React, { PropTypes } from "react";
import { FormattedNumber } from "react-intl";
import styled from "styled-components";

import { RideShape, RegistrationShape } from "techbikers/rides/shapes";
import { UserShape } from "techbikers/users/shapes";
import { ChapterShape } from "techbikers/chapters/shapes";

import Errors from "techbikers/errors/containers/Errors";
import PaymentForm from "techbikers/components/PaymentForm";
import Timestamp from "techbikers/components/Timestamp";
import RegistrationSteps from "techbikers/rides/components/RegistrationSteps";

const Description = styled.div`
  text-align: center;
`;

const CompleteRegistrationForm = ({ registration, ride, paymentProcessing, handlePayment }) => (
  <div>
    <RegistrationSteps step={3} />

    <div>
      <Description>
        <h3>Great news - we'd love to have you as part of TechBikers ride!</h3>

        {registration.signupExpires &&
          <p>
            <b>You have until <Timestamp format="D MMM" value={registration.signupExpires} /> to
            register.</b> After this you may lose your spot to someone else.</p>}

        <p>
          <b>The ride costs about <FormattedNumber style="currency" currency={ride.currency} value={ride.fullCost} /> per rider.
            We're asking for a minimum contribution of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} />.</b>
          If you are able, we welcome you to pay more. This means more sponsor money goes directly to Room to Read!
        </p>

        <Errors errorKey="payment" />
      </Description>

      <PaymentForm
        loading={paymentProcessing}
        submitText="Make payment & complete registration"
        onSubmit={({ amount, number, cvc, exp, name }) => handlePayment(amount, { number, cvc, exp, name })}
        customAmount
        minAmount={ride.price}
        currency={ride.currency}/>
    </div>
  </div>
);

CompleteRegistrationForm.propTypes = {
  registration: RegistrationShape,
  ride: RideShape,
  user: UserShape,
  chapter: ChapterShape,
  paymentProcessing: PropTypes.bool,
  handlePayment: PropTypes.func.isRequired
};

export default CompleteRegistrationForm;
