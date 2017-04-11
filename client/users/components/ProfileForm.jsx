import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import forms, { Form } from "newforms";
import styled from "styled-components";

import { UserShape } from "techbikers/users/shapes";
import { updateUser } from "techbikers/users/actions";

import FormField from "techbikers/components/FormField";
import Button from "techbikers/components/Button";

const ProfileFormDefinition = Form.extend({
  firstName: forms.CharField({
    label: "First name"
  }),
  lastName: forms.CharField({
    label: "Last name"
  }),
  // email: forms.CharField({
  //   label: "Email"
  // }),
  website: forms.CharField({
    label: "Website",
    required: false
  }),
  twitter: forms.CharField({
    label: "Twitter",
    required: false
  }),
  company: forms.CharField({
    label: "Company",
    required: false
  })
});

const mapDispatchToProps = {
  updateUser
};

const FormElement = styled.form`
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

@connect(null, mapDispatchToProps)
export default class ProfileForm extends Component {
  static propTypes = {
    user: UserShape.isRequired,
    updateUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      form: new ProfileFormDefinition({
        onChange: this.onFormChange,
        data: this.props.user
      })
    };
  }

  onFormChange = () => this.forceUpdate();

  saveProfile = event => {
    event.preventDefault();
    const { form } = this.state;
    const { user } = this.props;

    if (form.validate()) {
      this.props.updateUser({ id: user.id, ...form.cleanedData });
    }
  };

  render() {
    const fields = this.state.form.boundFieldsObj();
    return (
      <FormElement onSubmit={this.saveProfile}>
        <Row>
          <FormField field={fields.firstName} />
          <FormField field={fields.website} />
        </Row>
        <Row>
          <FormField field={fields.lastName} />
          <FormField field={fields.twitter} />
        </Row>
        <Row>
          {/* <FormField field={fields.email} /> */}
          <FormField field={fields.company} />
        </Row>
        <Row>
          <Button type="submit">
            Save
          </Button>
        </Row>
      </FormElement>
    );
  }
}
