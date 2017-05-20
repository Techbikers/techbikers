import React from "react";
import styled from "styled-components";

import Button from "techbikers/components/Button";

const Form = styled.form`
  margin-bottom: 26px;
`;

const ChangePasswordForm = () => (
  <Form>
    <h1>Change Your Password</h1>
    <div className="row centerText">
      <input name="oldpassword" type="password" />
    </div>
    <div className="row centerText">
      <input name="newpassword1" type="password" />
    </div>
    <div className="row centerText">
      <input name="newpassword2" type="password" />
    </div>
    <div className="row">
      <p className="centerText">
        <Button type="submit">Change Password</Button>
      </p>
    </div>
  </Form>
);

export default ChangePasswordForm;
