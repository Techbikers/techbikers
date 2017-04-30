import React, { PropTypes } from "react";
import styled from "styled-components";
import { shade } from "polished";

import Spinner from "techbikers/components/Spinner";
import {
  altColor,
  blue,
  green,
  grey3,
  errorColor,
  warningColor
} from "techbikers/utils/style-variables";

const buttonsKinds = ["standard", "alt", "positive", "warning", "destructive"];

const kindToColor = kind => {
  if (kind === "standard") {
    return blue;
  } else if (kind === "alt") {
    return altColor;
  } else if (kind === "positive") {
    return green;
  } else if (kind === "warning") {
    return warningColor;
  } else if (kind === "destructive") return errorColor;
};

const StyledButton = styled.button`
  position: relative;
  display: inline-block;
  padding: 0;
  margin: 15px 30px;
  color: inherit;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  text-align: center;
  letter-spacing: 1px;
  transition: all 0.2s;

  &,
  &:hover,
  &:active,
  &:focus {
    outline: none;
    color: #FFFFFF;
  }

  &:disabled {
    background-color: ${grey3};
    cursor: not-allowed;

    &:hover {
      background-color: ${grey3};
    }
  }

  &:active {
    top: 2px;
  }

  &::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  ${props => props.block ? `
    width: 100%;
  ` : ""}

  ${props => `
    background-color: ${kindToColor(props.kind)};

    &:hover  {
      background-color: ${shade(0.9, kindToColor(props.kind))};
    }

    &:active {
      background-color: ${shade(0.8, kindToColor(props.kind))};
    }
  `}
`;

StyledButton.propTypes = {
  block: PropTypes.bool,
  kind: PropTypes.oneOf(buttonsKinds)
};

const Contents = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 40px;

  ${props => props.loading ? `
    padding: 16px 20px;
  ` : ""}
`;

Contents.propTypes = {
  loading: PropTypes.bool
};

const Button = (
  {
    disabled = false,
    loading = false,
    block = false,
    kind = "standard",
    type = "button",
    children,
    ...props
  }
) => {
  return (
    <StyledButton
      disabled={loading || disabled}
      block={block}
      type={type}
      kind={kind}
      {...props}
    >
      <Contents loading={loading}>
        {loading ? <Spinner light noMargin size={32} /> : children}
      </Contents>
    </StyledButton>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
  kind: PropTypes.oneOf(buttonsKinds),
  block: PropTypes.bool,
  children: PropTypes.node
};

export default Button;
