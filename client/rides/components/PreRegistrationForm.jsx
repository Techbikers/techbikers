import React, { Component, PropTypes } from "react";
import { FormattedNumber } from "react-intl";
import forms, { Form } from "newforms";

import { RideShape } from "techbikers/rides/shapes";

import FormField from "techbikers/components/FormField";
import RegistrationSteps from "techbikers/rides/components/RegistrationSteps";

const DetailsForm = Form.extend({
  statement: forms.CharField({
    label: "Why do you want to do Techbikers?",
    widget: forms.Textarea
  }),
  ideas: forms.CharField({
    label: "What's your best fundraising idea to reach your Techbikers funding goal?",
    widget: forms.Textarea
  }),
  ability: forms.ChoiceField({
    required: false,
    label: "What's your cycling level?",
    choices: [[1, "Beginner"], [2, "Confident"], [3, "Intermediate"], [4, "Advanced"], [5, "Lycra Goddess/God"]]
  })
});

export default class RideRegistrationForm extends Component {
  static propTypes = {
    ride: RideShape.isRequired,
    registerUserForRide: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      form: new DetailsForm({ onChange: this.onFormChange })
    };
  }

  onFormChange = () => this.forceUpdate()

  handleRegistration = event => {
    event.preventDefault();
    const { form } = this.state;
    const { ride } = this.props;

    if (form.validate()) {
      this.props.registerUserForRide(ride.id, form.cleanedData);
    }
  }

  render() {
    const { ride } = this.props;
    const fields = this.state.form.boundFieldsObj();

    return (
      <div>
        <RegistrationSteps step={1} />
        <div>
          <p>
            {`We're thrilled you want to take part in ${ride.name}. To make sure we've
              got a great mix of people in the peloton, we've got a short application form below.`}
          </p>
          <p>
            Please bear in mind: <b>If you're selected, you will have to pay a minimum contribution
              of <FormattedNumber style="currency" currency={ride.currency} value={ride.price} /></b> to the ride
            cost to secure your spot. You can of course contribute more so more money is left for Room to Read!
          </p>
        </div>
        <form onSubmit={this.handleRegistration}>
          <div className="row centerText">
            <div className="span6">
              <FormField field={fields.statement} />
            </div>
            <div className="span6">
              <FormField field={fields.ideas} />
            </div>
            <div className="span6">
              <FormField field={fields.ability} />
            </div>
          </div>
          <div className="payment-form--submit" style={{ textAlign: "center" }}>
            <button className="btn btn-blue" type="submit">
              {`Apply for ${ride.name}`}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
