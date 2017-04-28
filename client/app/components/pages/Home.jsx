import React from "react";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import MailchimpForm from "techbikers/components/MailchimpForm";

const CoverImage = styled.div`
  background-image: url("/static/img/background.jpg");
  background-size: cover;
  padding: 100px 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Strapline = styled.div`
  text-shadow: 0px 0px 2px black;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
`;

const Strap1 = styled.div`
  font-size: 130px;
  line-height: 1;
`;

const Strap2 = styled.div`
  font-size: 22px;
  line-height: 1;
`;

const StrapAmp = styled.span`
  display: inline-block;
  font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
  font-weight: normal;
  font-style: italic;
  font-size: 48px;
  transform: translateY(5px);
`;

const Strap3 = styled.div`
  font-size: 166px;
  line-height: 1;
`;

const IndexPage = () => (
  <DocumentTitle title="Techbikers">
    <div>
      <CoverImage>
        <Strapline>
          <Strap1>Drop</Strap1>
          <Strap2>your laptop <StrapAmp>&</StrapAmp> get on your</Strap2>
          <Strap3>bike</Strap3>
        </Strapline>
      </CoverImage>

      <div className="content">
        <section id="mission">
          <header>
            <h1>Our Mission</h1>
          </header>

          <p>
            Techbikers is a collaboration of the London tech startup community to help children in need by supporting literacy charity Room to Read. Since 2012 over 300 tech professionals – including start-ups, venture capitalists and executives have cycled 960km in three Paris to London rides to raise money for this fantastic charity.
          </p>
        </section>

        <section>
          <header>
            <h1>Stats to Date</h1>
          </header>

          <div className="row">
            <div className="span6 stat">
              365
              <small>cyclists</small>
            </div>
          </div>

          <div className="row">
            <div className="span6 stat">
              £304,000
              <small>raised since 2012</small>
            </div>
          </div>

          <div className="row">
            <div className="span6 stat">
              1600km
              <small>ridden</small>
            </div>
          </div>
        </section>

        <MailchimpForm />
      </div>
    </div>
  </DocumentTitle>
);

export default IndexPage;
