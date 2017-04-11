import React from "react";
import Modal from "react-modal";

export const modalStyles = {
  overlay: {
    backgroundColor: "rgba(238, 238, 238, 0.98)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center"
  },
  content: {
    backgroundColor: "transparent",
    border: "none",
    maxWidth: "800px",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginTop: "auto",
    marginBottom: "auto",
    position: "relative",
    overflow: "visible",
    padding: "0"
  }
};

export default props => <Modal style={modalStyles} {...props} />;
