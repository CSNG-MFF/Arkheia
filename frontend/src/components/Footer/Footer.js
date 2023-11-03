import React from "react";

// reactstrap components
import { Container, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Nav>
          <NavItem>
            <NavLink href="http://csng.mff.cuni.cz/">
              CSNG
            </NavLink>
          </NavItem>
        </Nav>
        <div className="copyright">
          © {new Date().getFullYear()} made with{" "}
          Horváth Norbert
        </div>
      </Container>
    </footer>
  );
}

export default Footer