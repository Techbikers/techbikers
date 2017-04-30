import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import DocumentTitle from "react-document-title";
import { FormattedNumber } from "react-intl";

import { fetchRideById } from "techbikers/rides/actions";
import { fetchSponsorsByRide } from "techbikers/sponsors/actions";
import { getCurrentRide } from "techbikers/rides/selectors";
import { updatePageMeta } from "techbikers/app/actions";
import { getUsersOnCurrentRide } from "techbikers/users/selectors";
import { getChapterForCurrentRide } from "techbikers/chapters/selectors";
import { getSponsorsForCurrentRide } from "techbikers/sponsors/selectors";
import { RideShape } from "techbikers/rides/shapes";
import { ChapterShape } from "techbikers/chapters/shapes";

import RideRegistration from "techbikers/rides/containers/RideRegistration";
import RidersList from "techbikers/rides/components/RidersList";
import Timestamp from "techbikers/components/Timestamp";
import Spinner from "techbikers/components/Spinner";

const mapStateToProps = state => ({
  ride: getCurrentRide(state),
  chapter: getChapterForCurrentRide(state),
  riders: getUsersOnCurrentRide(state),
  sponsors: getSponsorsForCurrentRide(state)
});

const mapDispatchToProps = (dispatch, props) => ({
  fetchCurrentRide: () => dispatch(fetchRideById(props.params.id)),
  fetchSponsors: () => dispatch(fetchSponsorsByRide(props.params.id)),
  updatePageMetaForCurrentRide: (name, description) => dispatch(updatePageMeta({
    "og:title": `Techbikers - ${name}`,
    "og:description": description
  }))
});

@connect(mapStateToProps, mapDispatchToProps)
export default class RidePage extends Component {
  static propTypes = {
    ride: RideShape,
    chapter: ChapterShape,
    riders: PropTypes.arrayOf(PropTypes.object),
    fetchCurrentRide: PropTypes.func.isRequired,
    fetchSponsors: PropTypes.func.isRequired,
    updatePageMetaForCurrentRide: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { ride } = this.props;
    this.props.fetchCurrentRide();
    this.props.fetchSponsors();

    if (ride) {
      this.props.updatePageMetaForCurrentRide(ride.name, ride.strapline);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ride } = this.props;
    if (!ride && nextProps.ride) {
      this.props.updatePageMetaForCurrentRide(nextProps.ride.name, nextProps.ride.strapline);
    }
  }

  render() {
    const { ride, chapter, riders } = this.props;

    if (!ride) {
      return <Spinner>loading ride details</Spinner>;
    } else {
      return (
        <DocumentTitle title={`${ride.name} - Techbikers`}>
          <div itemScope itemType="http://schema.org/Event">
            <section id="header">
              <header>
                <h1 itemProp="name">{ride.name}</h1>
                <h3>
                  <Timestamp value={ride.startDate} format="D MMM" itemProp="startDate" /> to <Timestamp value={ride.endDate} format="D MMM YYYY" itemProp="endDate" />
                </h3>
                <h3>Part of the <Link to={`/chapters/${chapter.name.toLowerCase()}`} >{chapter.name}</Link> chapter</h3>
              </header>

              <div className="content">
                <h2>We've raised <FormattedNumber style="currency" currency={ride.currency} value={ride.fundraisingTotal} maximumFractionDigits={0} minimumFractionDigits={0} />!</h2>
              </div>
            </section>

            <RideRegistration />

            <RidersList riders={riders} />

            <section id="description">
              <div className="content" dangerouslySetInnerHTML={{ __html: ride.descriptionHtml }} />
            </section>
          </div>
        </DocumentTitle>
      );
    }
  }
}
