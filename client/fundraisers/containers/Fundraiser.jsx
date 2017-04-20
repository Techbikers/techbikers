import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { FormattedNumber } from "react-intl";
import styled from "styled-components";

import { fetchUserById } from "techbikers/users/actions";
import { UserShape } from "techbikers/users/shapes";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import Avatar from "techbikers/users/components/Avatar";

const mapStateToProps = (state, ownProps) => {
  const { user } = ownProps;
  return {
    userObject: state.entities.user ? state.entities.user[user] : null
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  getUser: () => dispatch(fetchUserById(props.user))
});

const FundraiserContainer = styled.div`
  position: relative;
  padding: 10px 0;
  width: 100%;
  height: 100px;
`;

const FundraiserPosition = styled.span`
  position: absolute;
  left: 0;
  width: 45px;
  height: 45px;
  font: 18px/22px 'Arial', sans-serif;
  text-align: center;
  background: url("/static/img/place_other.png") center bottom;
  padding-top: 10px;

  ${props => props.position <= 3 ? `
    height: 61px;
    padding-top: 28px;
    margin-top: 0;
    -webkit-background-size: 45px 61px;
    -moz-background-size: 45px 61px;
    background-size: 45px 61px;
  ` : ""}
  ${props => props.position === 1 ? `
    background-image: url("/static/img/place_first_x2.png");
  ` : ""}
  ${props => props.position === 2 ? `
    background-image: url("/static/img/place_second_x2.png");
  ` : ""}
  ${props => props.position === 3 ? `
    background-image: url("/static/img/place_third_x2.png");
  ` : ""}
`;

FundraiserPosition.propTypes = {
  position: PropTypes.number.required
};

const FundraiserDetails = styled.div`
  position: absolute;
  left: 150px;
`;

const FundraiserHeader = styled.h3`
  margin: 0;
`;

const SponsorButton = styled.div`
  position: absolute;
  top: 15px;
  right: 10px;
  z-index: 1;
`;

const FundraiserLink = styled(Link)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

@connect(mapStateToProps, mapDispatchToProps)
export default class Fundraiser extends Component {
  static propTypes = {
    fundraiser: FundraiserShape,
    position: PropTypes.number.isRequired,
    userObject: UserShape,
    currency: PropTypes.string,
    totalRaised: PropTypes.string,
    pageUrl: PropTypes.string,
    getUser: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { userObject } = this.props;

    if (!userObject) {
      this.props.getUser();
    }
  }

  render() {
    const {
      currency,
      totalRaised,
      pageUrl,
      position,
      userObject: user
    } = this.props;

    return (
      <FundraiserContainer>
        <FundraiserPosition position={position}>
          {position || ""}
        </FundraiserPosition>

        <Avatar {...user} />

        <FundraiserDetails>
          <FundraiserHeader>{user ? user.name : "loading..."}</FundraiserHeader>
          <p>
            <FormattedNumber
              style="currency"
              currency={currency}
              value={totalRaised}
            />
            {" "}
            <span>raised so far</span>
          </p>
        </FundraiserDetails>

        <SponsorButton>
          <a href={pageUrl} className="btn btn-green">
            Sponsor now
          </a>
        </SponsorButton>

        {user && <FundraiserLink to={`/riders/${user.id}`} />}
      </FundraiserContainer>
    );
  }
}
