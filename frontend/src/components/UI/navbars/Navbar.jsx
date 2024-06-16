import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLogout } from '../../../hooks/auth/useLogout'
import { useAuthContext } from '../../../hooks/auth/useAuthContext'

const MainNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
    logout()
    navigate('/');
  }

  return (
    <Navbar bg="primary" data-bs-theme="dark" className="text-white ">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          LOGO
        </Navbar.Brand>
        {!user ? (
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/auth/login">
              Login
            </Nav.Link>
            <Nav.Link as={NavLink} to="/auth/signup">
              Signup
            </Nav.Link>
          </Nav>
        ) : (
          <NavDropdown
            title="My Profile"
            id="basic-nav-dropdown"
            align="end"
            data-bs-theme="light"
          >
            <NavDropdown.Item as={NavLink} to="user">
              View my profile
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item as={NavLink} to="user/edit-profile">
              Edit Profile
            </NavDropdown.Item>
            <NavDropdown.Item as={NavLink} to="user/change-password">
              Change Password
            </NavDropdown.Item>
            <NavDropdown.Item
              as={NavLink}
              to="user/delete-account"
              className="text-danger"
            >
              Delete Acount
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="fw-bold" onClick={handleClick}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        )}
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
