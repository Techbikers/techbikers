import React, { PropTypes, createElement as e } from "react";
import styled from "styled-components";
import { shade } from "polished";
import { Link } from "react-router";

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

const StyledButton = styled(({ tag, children, ...props }) =>
  e(tag, props, children))`
  position: relative;
  display: inline-block;
  padding: 0;
  color: inherit;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  letter-spacing: 1px;
  transition: all 0.2s;
  -webkit-appearance: none;

  &,
  &:hover,
  &:active,
  &:focus {
    outline: none;
    color: #FFFFFF;
    text-decoration: none;
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

  ${props => props.full ? `
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
  justify-content: center;
  padding: 16px 40px;

  ${props => props.loading ? `
    padding: 16px 20px;
  ` : ""}
`;

Contents.propTypes = {
  loading: PropTypes.bool
};

const typeToTag = type => {
  if (type === "link") {
    return Link;
  } else if (type === "a") {
    return "a";
  } else {
    return "button";
  }
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
) => (
  <StyledButton
    disabled={loading || disabled}
    block={block}
    type={type === "link" || type === "a" ? null : type}
    kind={kind}
    tag={typeToTag(type)}
    {...props}
  >
    <Contents loading={loading}>
      {loading ? <Spinner light noMargin size={32} /> : children}
    </Contents>
  </StyledButton>
);

Button.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  type: PropTypes.string,
  kind: PropTypes.oneOf(buttonsKinds),
  block: PropTypes.bool,
  href: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.node
};

export default Button;
