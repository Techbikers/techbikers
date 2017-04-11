import React from "react";
import Modal from "react-modal";

export const modalStyles = {
  overlay: {
    backgroundColor: "rgba(238, 238, 238, 0.98)"
  },
  content: {
    backgroundColor: "transparent",
    border: "none",
    maxWidth: "800px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    marginBottom: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0"
  }
};

export default props => <Modal style={modalStyles} {...props} />;
