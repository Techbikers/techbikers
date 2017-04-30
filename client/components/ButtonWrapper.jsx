import React, { PropTypes } from "react";
import cx from "classnames";

import Spinner from "techbikers/components/Spinner";

import styles from "./buttonWrapper.css";

const buttonsKinds = ["standard", "alt", "positive", "warning", "destructive"];

const wrapComponent = WrappedComponent => {
  const BaseButton = ({
    className,
    disabled = false,
    loading = false,
    block = false,
    size = "medium",
    kind = "standard",
    children,
    ...props }) => {
    const computedClassName = cx(
      styles.Button,
      styles[kind],
      styles[size],
      {
        [styles.loading]: loading,
        [styles.disabled]: loading || disabled,
        [styles.block]: block
      },
      className
    );

    return (
      <WrappedComponent className={computedClassName} {...props} >
        <div className={styles.contents}>
          {loading ? <Spinner light noMargin size={32} /> : children}
        </div>
      </WrappedComponent>
    );
  };

  BaseButton.propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    kind: PropTypes.oneOf(buttonsKinds),
    block: PropTypes.bool,
    children: PropTypes.node
  };

  return BaseButton;
};

export default function buttonWrapper() {
  return WrappedComponent => wrapComponent(WrappedComponent);
}
