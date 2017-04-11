import React, { PropTypes } from "react";
import { IntlProvider } from "react-intl";

import { SEGMENT_TRACKING_KEY } from "techbikers/config";

import Modal from "techbikers/components/Modal";
import AnalyticsLoader from "techbikers/app/components/AnalyticsLoader";
import Header from "techbikers/app/components/Header";
import Footer from "techbikers/app/components/Footer";
import MetaTags from "techbikers/app/components/MetaTags";
import NotificationArea from "techbikers/notifications/containers/NotificationArea";

const App = ({ children, pageMeta, modalChildren }) => (
  <IntlProvider locale="en">
    <div>
      <AnalyticsLoader segmentKey={SEGMENT_TRACKING_KEY} />
      <MetaTags {...pageMeta} />
      <Header />
      {children}
      <Footer />
      <NotificationArea />
      <Modal isOpen={modalChildren !== null}>
        {modalChildren}
      </Modal>
    </div>
  </IntlProvider>
);

App.propTypes = {
  children: PropTypes.node,
  pageMeta: PropTypes.object,
  modalChildren: PropTypes.node
};

export default App;
