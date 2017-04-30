import React, { PropTypes } from "react";
import styled from "styled-components";

import Notification from "techbikers/notifications/components/Notification";
import { brandColor } from "techbikers/utils/style-variables";

const Root = styled(Notification)`
  background: #333;
`;

const OuterProgressBar = styled.div`
  width: 100%;
  height: 0.5em;
  margin: 0.4em 0;
  border-radius: 0.5em;
  background: white;
`;

const InnerProgressBar = styled.div`
  height: 100%;
  min-width: 1em;
  border-radius: 0.5em;
  background: ${brandColor};
  width: ${props => `${props.progress}%`}
`;

InnerProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

const Text = styled.span`
  max-width: 100%;
  font-size: 0.8rem;
`;

const ProgressNotification = ({ className, text, progress }) => (
  <Root>
    <OuterProgressBar>
      <InnerProgressBar propgress={progress} />
    </OuterProgressBar>
    <Text>{text}</Text>
  </Root>
);

ProgressNotification.propTypes = {
  text: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired
};

export default ProgressNotification;
