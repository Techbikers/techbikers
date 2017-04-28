import _ from "lodash";
import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { darken } from "polished";

import { green, red, yellow } from "techbikers/utils/style-variables";

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

const StepsList = styled.ol`
  margin: 15px 0;
  padding: 0;
  display: flex;
`;

const Step = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  flex-basis: 0;
  color: #aaa;

  color:
    ${props => props.state === "active" ? darken(0.05, yellow) : ""}
    ${props => props.state === "done" ? green : ""}
    ${props => props.state === "pending" ? darken(0.05, yellow) : ""}
    ${props => props.state === "failed" ? red : ""}
`;

Step.propTypes = {
  state: PropTypes.string.required
};

const Icon = styled.span`
  display: block;
  width: 40px;
  height: 40px;
  line-height: 39px;
  border: 2px solid #aaa;
  font-size: 19px;
  border-radius: 50%;
  text-align: center;

  ${props => props.state === "active" ? `
    color: white;
    background: ${darken(0.05, yellow)};
    border-color: ${darken(0.05, yellow)};
  ` : ""}

  ${props => props.state === "done" ? `
    color: white;
    background: ${green};
    border-color: ${green};
  ` : ""}

  ${props => props.state === "pending" ? `
    color: ${darken(0.05, yellow)};
    background: white;
    font-size: 48px;
    border: none;
    width: 46px;
  ` : ""}

  ${props => props.state === "failed" ? `
    color: white;
    background: ${red};
    border-color: ${red};
  ` : ""}
`;

Icon.propTypes = {
  state: PropTypes.string
};

const StepDescription = styled.span`
  font-size: 16px;
`;

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
      <StepsList>
        {_.map(this.state.steps, step => {
          return this.renderStep(step);
        })}
      </StepsList>
    );
  }

  renderStep(step) {
    return (
      <Step state={step.state} key={step.number}>
        {step.state == "done" ?
          <Icon state={step.state} className="material-icons">done</Icon> :
        step.state == "pending" ?
          <Icon state={step.state} className="material-icons">schedule</Icon> :
        step.state == "failed" ?
          <Icon state={step.state} className="material-icons">clear</Icon> :
          <Icon state={step.state}>{step.number}</Icon>}
        <StepDescription>{step.text}</StepDescription>
      </Step>
    );
  }
}

export default RegistrationSteps;
