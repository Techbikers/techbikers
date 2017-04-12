import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import DocumentTitle from "react-document-title";
import styled from "styled-components";

import { getLeaderboard } from "techbikers/fundraisers/selectors";
import { fetchActiveFundraisers } from "techbikers/fundraisers/actions";
import { FundraiserShape } from "techbikers/fundraisers/shapes";

import Fundraiser from "techbikers/fundraisers/containers/Fundraiser";

const mapStateToProps = state => ({
  fundraisers: getLeaderboard(state)
});

const mapDispatchToProps = {
  fetchActiveFundraisers
};

const LeaderboardList = styled.ul`
  list-style: none;
`;

const LeaderboardItem = styled.li`
  margin: 10px 0;
  border-bottom: 1px solid #e2e2e2;
`;

@connect(mapStateToProps, mapDispatchToProps)
export default class Leaderboard extends Component {
  static propTypes = {
    fundraisers: PropTypes.arrayOf(FundraiserShape),
    fetchActiveFundraisers: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.fetchActiveFundraisers();
  }

  render() {
    const { fundraisers } = this.props;

    return (
      <DocumentTitle title="Donate – Techbikers">
        <div className="content">
          <section id="leaderboard">
            <header>
              <h1>Donate to one of our many riders</h1>
            </header>

            <LeaderboardList>
              {fundraisers.map((fundraiser, position) => (
                <LeaderboardItem key={fundraiser.id}>
                  <Fundraiser position={position + 1} {...fundraiser} />
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </section>
        </div>
      </DocumentTitle>
    );
  }
}
