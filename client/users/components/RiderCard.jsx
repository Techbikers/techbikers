import React, { PropTypes } from "react";
import { Link } from "react-router";
import styled from "styled-components";
import Avatar from "techbikers/users/components/Avatar";
import { FundraiserShape } from "techbikers/fundraisers/shapes";
import { FormattedNumber } from "react-intl";

const Rider = styled.div`
  position: relative;
  padding: 10px 0;
  width: 100%;
  height: 100px;
`;

const RiderDetails = styled.div`
  position: absolute;
  left: 90px;

  p {
    text-align: left;
    margin-top: 0px;
  }
`;

const RiderHeader = styled.h3`
  margin: 0;
  text-align: left;
`;

const SponsorButton = styled.div`
  position: absolute;
  right: 10px;
  z-index: 1;

  a {
    margin: 0px;
    padding: 5px 20px;
  }
`;

const RiderAvatar = styled.div`
  position: absolute;
  left: 15px;
`;

/**
 * Return a normalized Twitter link
 */
const twitterLink = twitter => {
  if (!twitter) {
    return "";
  }

  const twitterHandle = twitter
    .split("/") 
    .pop() // if there's more than just the Twitter handle, remove it
    .replace(/^@/, ""); // if there's an "@" symbol, remove it
  return (
    <a key="twiter" href={`https://twitter.com/${twitterHandle}`}>
      @{twitterHandle}
    </a>
  );
};

/**
 * Return a link or a company name, depending on which data is available
*/
const companyLink = (name, url) => {
  if (!url) {
    return "";
  }

  const fullUrl = /^https?:\/\//i.test(url)
    ? url.toLowerCase()
    : `http://${url.toLowerCase()}`;
  const isLinkedIn = fullUrl.indexOf("linkedin.") > -1;

  if (name) {
    if (url && !isLinkedIn) {
      return (
        <a key="www" href={`${fullUrl}`}>
          {name}
        </a>
      );
    } else {
      return name;
    }
  } else {
    if (url && !isLinkedIn) {
      return (
        <a key="www" href={`${fullUrl}`}>
          {fullUrl}
        </a>
      );
    } else {
      return "";
    }
  }
};

/**
 * Return a link if it is a LinkedIn link
 */
const linkedInLink = url => {
  if (!url) {
    return "";
  }

  const fullUrl = /^https?:\/\//i.test(url)
    ? url.toLowerCase()
    : `http://${url.toLowerCase()}`;
  if (fullUrl.indexOf("linkedin.") === -1) {
    return "";
  } else {
    return (
      <a key="li" href={`${fullUrl}`}>
        LinkedIn
      </a>
    );
  }
};

const RiderCard = ({
  id,
  name,
  avatar,
  size = 60,
  latestFundraiser,
  company,
  donationPage,
  twitter,
  website
}) => (
  <Rider>
    <RiderAvatar>
      <Link to={`/riders/${id}`}>
        <Avatar name={name} avatar={avatar} size={size} />
      </Link>
    </RiderAvatar>
    <RiderDetails>
      <RiderHeader>
        <Link to={`/riders/${id}`}>{name}</Link>
      </RiderHeader>
      <p>
        {[
          // construct list of urls
          twitterLink(twitter),
          companyLink(company, website),
          linkedInLink(website)
        ]
          // remove the empty ones
          .filter(item => !!item)
          // join the remaining ones using " / " as the separator
          .reduce(
            (prev, curr) => (prev === null ? [curr] : [...prev, " / ", curr]),
            null
          )}
      </p>
    </RiderDetails>
    {donationPage && latestFundraiser ? (
      <SponsorButton>
        <a href={donationPage} className="btn btn-green">
          <FormattedNumber
            style="currency"
            currency={latestFundraiser.currency}
            value={latestFundraiser.totalRaised}/>{" "}
          <span>raised so far</span>
          <br />
          Sponsor now
        </a>
      </SponsorButton>
    ) : null}
  </Rider>
);

RiderCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  avatar: PropTypes.string,
  size: PropTypes.number,
  latestFundraiser: FundraiserShape,
  company: PropTypes.string,
  donationPage: PropTypes.string,
  twitter: PropTypes.string,
  website: PropTypes.string
};

export default RiderCard;
