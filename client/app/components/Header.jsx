import React, { PropTypes } from "react";
import { Link } from "react-router";
import styled from "styled-components";

const Content = styled.header`
  width: 800px;
  margin: auto;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 140px;
`;

const NavLink = styled(Link)`
  transition: color .3s linear;
  margin-right: 20px;
  color: #666;

  &:hover {
    text-decoration: none;
    ${props => (props.color ? `color: ${props.color}` : "")}
  }
`;

NavLink.propTypes = {
  color: PropTypes.string
};

const BlogLink = styled.a`
  transition: color .3s linear;
  margin-right: 20px;
  color: #666;

  &:hover {
    text-decoration: none;
  }
`;

const MainLink = styled(NavLink)`
  height: 140px;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => (
  <Content role="header">
    <Navigation>
      <Section>
        <MainLink to="/">
          <img src="/static/img/logo@2x.png" alt="TechBikers" width="125" />
        </MainLink>

        <NavLink to="/rides" color="#eb1c24">
          Rides
        </NavLink>

        <NavLink to="/about" color="#4494c7">
          About
        </NavLink>

        <NavLink to="/the_charity" color="#76c15a">
          Charity
        </NavLink>

        <BlogLink href="https://medium.com/@techbikers">
          Blog
        </BlogLink>
      </Section>

      <Section>
        <Link className="btn btn-green" to="/donate">Donate!</Link>
      </Section>
    </Navigation>
  </Content>
);

export default Header;
