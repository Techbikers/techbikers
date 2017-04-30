import React, { Component, PropTypes } from "react";
import forms, { Form } from "newforms";
import styled from "styled-components";

import Button from "techbikers/components/Button";
import PaymentUtils from "../utils/paymentUtils";
import FormField from "./FormField";

const FormComponent = styled.form`
  width: 420px;
  padding: 20px;
  margin: auto;
  background: #f5f5f5;
`;

const PaymentFormField = styled(FormField)`
  width: 100%;
`;

const Amount = styled.h2`
  margin: 0 0 10px 35px;
`;

const AmountFormField = styled(PaymentFormField)`
  width: 90px;

  input {
    margin: 0;
    margin-bottom: 1px;
  }
`;

const CardDetails = styled.div`
  height: 200px;
  width: 350px;
  padding: 10px 20px;
  background: #DDD;
  border-radius: 16px;
  margin: 0 auto 20px auto;
`;

const Title = styled.h3`
  margin: 10px 0 20px 0;
`;

const Row = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const CardNumber = styled.div`
  position: relative;
  width: 78%;
`;

const CardIcon = styled.span`
  position: absolute;
  top: 9px;
  right: 9px;
  display: block;
  width: 32px;
  height: 20px;
  z-index: 20;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: 32px 20px;

  ${props => props.type === "amex" ? `
    background-image: url("/static/img/icons/amex.png");
  ` : ""}

  ${props => props.type === "diners" ? `
    background-image: url("/static/img/icons/diners.png");
  ` : ""}

  ${props => props.type === "discover" ? `
    background-image: url("/static/img/icons/discover.png");
  ` : ""}

  ${props => props.type === "jcb" ? `
    background-image: url("/static/img/icons/jcb.png");
  ` : ""}

  ${props => props.type === "mastercard" ? `
    background-image: url("/static/img/icons/mastercard.png");
  ` : ""}

  ${props => props.type === "visa" ? `
    background-image: url("/static/img/icons/visa.png");
  ` : ""}
`;

CardIcon.propTypes = {
  type: PropTypes.string
};

const Cvc = styled.div`
  width: 18%;
`;

const NameOnCard = styled.div`
  width: 60%;
`;

const ExpiryDate = styled.div`
  width: 92px;
`;

const Submit = styled.div`
  padding: 15px;
  margin: 0 -20px -20px -20px;
  background: #e2e2e2;
  border-radius: 0 0 3px 3px;
`;

export default class PaymentForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    currency: PropTypes.string,
    submitText: PropTypes.string,
    minAmount: PropTypes.number,
    onSubmit: PropTypes.func.isRequired,
    customAmount: PropTypes.bool
  };

  static defaultProps = {
    submitText: "Submit",
    customAmount: true,
    minAmount: 0
  };

  constructor(props) {
    super(props);
    this.state = {
      form: this.paymentDetailsForm()
    };
  }

  paymentDetailsForm() {
    const { minAmount, customAmount } = this.props;

    const PaymentDetailsForm = Form.extend({
      amount: forms.DecimalField({
        label: minAmount,
        required: customAmount,
        initial: minAmount,
        minValue: minAmount,
        maxDecimalPlaces: 2
      }),
      number: forms.CharField({
        initial: "",
        label: "•••• •••• •••• ••••",
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCardNumber(event);
            PaymentUtils.formatCardNumber(event);
          },
          onKeyDown: event => {
            PaymentUtils.formatBackCardNumber(event);
          },
          onChange: event => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onPaste: event => {
            PaymentUtils.reFormatCardNumber(event);
          },
          onInput: event => {
            PaymentUtils.reFormatCardNumber(event);
          }
        }
      }),
      cvc: forms.CharField({
        label: "•••",
        maxLength: 4,
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictCVC(event);
          },
          onPaste: event => {
            PaymentUtils.reFormatCVC(event);
          },
          onChange: event => {
            PaymentUtils.reFormatCVC(event);
          },
          onInput: event => {
            PaymentUtils.reFormatCVC(event);
          }
        }
      }),
      exp: forms.CharField({
        label: "MM / YY",
        widgetAttrs: {
          onKeyPress: event => {
            PaymentUtils.restrictNumeric(event);
            PaymentUtils.restrictExpiry(event);
            PaymentUtils.formatExpiry(event);
            PaymentUtils.formatForwardSlashAndSpace(event);
            PaymentUtils.formatForwardExpiry(event);
          },
          onKeyDown: event => {
            PaymentUtils.formatBackExpiry(event);
          },
          onChange: event => {
            PaymentUtils.reFormatExpiry(event);
          },
          onInput: event => {
            PaymentUtils.reFormatExpiry(event);
          }
        }
      }),
      name: forms.CharField({
        label: "Name on card"
      }),
      clean() {
        if (this.cleanedData.exp) {
          const { month, year } = PaymentUtils.getCardExpiryVal(this.cleanedData.exp);
          this.cleanedData["exp_month"] = month;
          this.cleanedData["exp_year"] = year;
        }
      }
    });
    return new PaymentDetailsForm({ onChange: this.onFormChange });
  }

  onFormChange = () => this.forceUpdate()

  handleFormSubmit = event => {
    event.preventDefault();
    const { form } = this.state;

    if (form.validate()) {
      this.props.onSubmit(form.cleanedData);
    }
  }

  render() {
    const fields = this.state.form.boundFieldsObj();
    const { customAmount, submitText, currency, loading } = this.props;

    return (
      <FormComponent onSubmit={this.handleFormSubmit}>
        {customAmount ?
          <Amount>
            I can contribute {currency} <AmountFormField field={fields.amount} />
          </Amount> : ""}

        <CardDetails>
          <Title>Card Details</Title>
          <Row>
            <CardNumber>
              <PaymentFormField field={fields.number} />
              <CardIcon type={PaymentUtils.getCardType(this.state.form.data.number)} />
            </CardNumber>
            <Cvc>
              <PaymentFormField field={fields.cvc} />
            </Cvc>
          </Row>

          <Row>
            <NameOnCard>
              <PaymentFormField field={fields.name} />
            </NameOnCard>

            <ExpiryDate>
              <PaymentFormField field={fields.exp} />
            </ExpiryDate>
          </Row>
        </CardDetails>

        <Submit>
          <Button type="submit" loading={loading}>
            {submitText}
          </Button>
        </Submit>
      </FormComponent>
    );
  }
}
