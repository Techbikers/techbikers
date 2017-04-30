import React, { PropTypes } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { NotificationShape } from "techbikers/notifications/shapes";

import ProgressNotification
  from "techbikers/notifications/components/ProgressNotification";
import TextNotification
  from "techbikers/notifications/components/TextNotification";

const Root = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 999;

  & > * {
    margin: 16px;
  }
`;

const mapStateToProps = state => {
  const { queue, byId } = state.notifications;

  if (queue.length > 0) {
    const firstId = queue[0];
    return { currentNotification: byId[firstId] };
  } else {
    return { currentNotification: null };
  }
};

const NotificationRenderer = ({ notification }) => {
  switch (notification.type) {
    case "progress":
      return <ProgressNotification {...notification} />;
    case "text":
    case "error":
      return <TextNotification {...notification} />;
    default:
      throw new Error(`Unknown notification type: ${notification.type}`);
  }
};

NotificationRenderer.propTypes = {
  notification: NotificationShape
};

const NotificationArea = ({ currentNotification }) => (
  <Root>
    {currentNotification &&
      <NotificationRenderer notification={currentNotification} />}
  </Root>
);

NotificationArea.propTypes = {
  currentNotification: NotificationShape
};

export default connect(mapStateToProps)(NotificationArea);
