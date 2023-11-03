import React from "react";

// reactstrap components
import { 
  Navbar,
  Nav, 
  NavItem, 
  NavLink 
} from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer" style={{ 
      position: 'absolute',
      bottom: '0',
      width: '100%', 
      }}>
      <Navbar color='dark' dark >
        <Nav style={{ float: 'left' }}>
          <NavItem>
            <NavLink href="http://csng.mff.cuni.cz/">
              CSNG
            </NavLink>
          </NavItem>
        </Nav>
        <Nav style={{ float: 'right', color: 'white' }}>
          <NavItem >
            © {new Date().getFullYear()} made by Horváth Norbert
          </NavItem>
        </Nav>
      </Navbar>
    </footer>
  );
}

export default Footer