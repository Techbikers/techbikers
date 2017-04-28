import React from "react";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import MailchimpForm from "techbikers/components/MailchimpForm";
import Content from "techbikers/app/components/Content";

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

const Stats = styled.section`
  display: flex;
  flex-direction: column;
`;

const Stat = styled.div`
  margin-top: 26px;
  text-align: center;
  font-size: 80px;
  font-weight: bold;
  line-height: 1;
`;

const StatSmall = styled.small`
  display: block;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
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

      <Content>
        <section id="mission">
          <header>
            <h1>Our Mission</h1>
          </header>

          <p>
            Techbikers is a collaboration of the London tech startup community to help children in need by supporting literacy charity Room to Read. Since 2012 over 300 tech professionals – including start-ups, venture capitalists and executives have cycled 960km in three Paris to London rides to raise money for this fantastic charity.
          </p>
        </section>

        <Stats>
          <header>
            <h1>Stats to Date</h1>
          </header>

          <Stat>365 <StatSmall>cyclists</StatSmall></Stat>
          <Stat>£304,000 <StatSmall>raised since 2012</StatSmall></Stat>
          <Stat>1600km <StatSmall>ridden</StatSmall></Stat>
        </Stats>

        <MailchimpForm />
      </Content>
    </div>
  </DocumentTitle>
);

export default IndexPage;
