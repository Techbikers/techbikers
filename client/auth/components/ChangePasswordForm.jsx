import React from "react";

import Button from "techbikers/components/Button";

const ChangePasswordForm = () => (
  <form>
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
  </form>
);

export default ChangePasswordForm;
