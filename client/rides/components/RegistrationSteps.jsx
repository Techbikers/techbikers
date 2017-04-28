import _ from "lodash";
import React, { Component } from "react";

const defaultSteps = [
  {
    number: 1,
    text: "Register Interest",
    state: ""
  },
  {
    number: 2,
    text: "Invites Sent",
    state: ""
  },
  {
    number: 3,
    text: "Confirm & Pay",
    state: ""
  }
];

class RegistrationSteps extends Component {
  static propTypes = {
    step: React.PropTypes.number,
    failed: React.PropTypes.bool
  }

  static defaultProps = {
    step: 1,
    state: "active"
  }

  constructor(options) {
    super(options);
    this.state = {
      steps: defaultSteps
    };
  }

  componentDidMount() {
    this.updateSteps();
  }

  componentWillReceiveProps() {
    this.updateSteps();
  }

  updateSteps() {
    const newSteps = _.map(this.state.steps, step => {
      if (this.props.step == step.number) {
        step.state = this.props.state;
      } else if (this.props.step > step.number) {
        step.state = "done";
      } else {
        step.state = "";
      }
      return step;
    });
    this.setState({ "steps": newSteps });
  }

  render() {
    return (
      <ol className="steps">
        {_.map(this.state.steps, step => {
          return this.renderStep(step);
        })}
      </ol>
    );
  }

  renderStep(step) {
    return (
      <li key={step.number} className={`step-${step.number} ${step.state}`}>
        {step.state == "done" ?
          <span className="material-icons">done</span> :
        step.state == "pending" ?
          <span className="material-icons">schedule</span> :
        step.state == "failed" ?
          <span className="material-icons">clear</span> :
          <span>{step.number}</span>}
        <span>{step.text}</span>
      </li>
    );
  }
}

export default RegistrationSteps;
