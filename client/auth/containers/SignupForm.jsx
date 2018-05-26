import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Link, locationShape } from "react-router";
import forms, { Form } from "newforms";
import { slice } from "lodash";
import styled from "styled-components";

import { getLocation } from "techbikers/app/selectors";
import { signup } from "techbikers/auth/actions";

import FormField from "techbikers/components/FormField";
import Button from "techbikers/components/Button";

/* eslint-disable camelcase, babel/new-cap */
const NewRiderForm = Form.extend({
  first_name: forms.CharField(),
  last_name: forms.CharField(),
  email: forms.EmailField(),
  company: forms.CharField({ required: false }),
  website: forms.URLField({ required: false }),
  twitter: forms.CharField({ required: false }),
  password: forms.CharField({ label: "Password", widget: forms.PasswordInput }),
  password_confirm: forms.CharField({ label: "Confirm password", widget: forms.PasswordInput }),

  cleanWebsite() {
    // Add a protocol if there isn't already one
    let url = this.cleanedData.website;
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = `http://${url}`;
    }
    return url;
  },

  clean() {
    // Check that the passwords match
    if (this.cleanedData.password !== this.cleanedData.password_confirm) {
      const message = "Passwords don't match.";
      this.addError("password_confirm", message);
      throw forms.ValidationError(message);
    }
  }
});
/* eslint-enable */

const mapStateToProps = state => ({
  location: getLocation(state),
  loading: state.auth.state === "authenticating"
});

const mapDispatchToProps = {
  signup
};

const FormElement = styled.form`
  margin-bottom: 26px;
`;

@connect(mapStateToProps, mapDispatchToProps)
export default class SignupForm extends Component {
  static propTypes = {
    location: locationShape,
    loading: PropTypes.bool,
    signup: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      form: new NewRiderForm({
        onChange: this.onFormChange
      })
    };
  }

  onFormChange = () => this.forceUpdate()

  handleSignup = event => {
    event.preventDefault();
    const { form } = this.state;

    if (form.validate()) {
      this.props.signup(form.cleanedData);
    }
  }

  render() {
    const { form } = this.state;
    const { loading, location } = this.props;

    const fields = form.boundFieldsObj();
    const fieldComponents = Object.keys(fields).map(key => {
      let field = fields[key];
      return <FormField key={field.htmlName} field={field} />;
    });

    return (
      <FormElement onSubmit={this.handleSignup}>
        <div className="row">
          <div className="span2 offset1">
            {slice(fieldComponents, 0, 4)}
          </div>

          <div className="span2">
            {slice(fieldComponents, 4, 8)}
          </div>
        </div>
        <p className="centerText">
          <Link to={{ pathname: "/login", state: { ...location.state } }}>
            Already have an account from a previous ride?
          </Link>
        </p>
        <p className="centerText">
          <Button type="submit" loading={loading}>
            Sign Up
          </Button>
        </p>
      </FormElement>
    );
  }
}
