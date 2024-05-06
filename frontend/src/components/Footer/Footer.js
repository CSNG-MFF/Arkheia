import React from "react";
import '../../styles/footer.css'
import { 
  Navbar,
  Nav, 
  NavItem, 
  NavLink 
} from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer" style={{ width: '100%',  marginTop: 20 }}>
      <Navbar className='footerNavbar' color='secondary' >
        <Nav style={{ float: 'left' }}>
          <NavItem>
            <NavLink className='footerLink' href="http://csng.mff.cuni.cz/">
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