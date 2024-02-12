import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthContext';

const NavbarCustom = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowOffcanvas(false); // Close offcanvas on logout
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              alt="Logo"
              src="/logo.png"
              width="70"
              height="70"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/"><h1 className='title'>< span className="highlight">H</span>aggle<span className="highlight">H</span>ouse</h1> </Nav.Link>
          </Nav>

          {/* Offcanvas Toggle Button (visible on XS to MD screens) */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(true)} className="d-lg-none" />

          {/* Navigation Links and Actions (visible on LG screens and up) */}
          <Nav className="ms-auto d-none d-lg-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Button variant="warning" as={Link} to="/login" className="me-2">Login </Button>
                <Button variant="light" as={Link} to="/sign-up">Sign-Up</Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="text-nowrap ms-2">
                  {currentUser.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/saved">❤️ Favourites</Dropdown.Item>
                  <Dropdown.Item as={Link} to="#/messages">💰 Bids</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/settings">⚙️ Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>🔓 Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Container>

        {/* Offcanvas (visible on XS to MD screens when toggled) */}
        <Offcanvas scroll="false" backdrop="true" show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="custom-offcanvas-dark" >
          <Offcanvas.Header closeButton>
            <Button className="d-grid gap-2" variant="dark" size="sm" disabled>Menu</Button>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {!isAuthenticated ? (
              <>
                <Nav.Link className="custom-nav-link" as={Link} to="/login" onClick={() => setShowOffcanvas(false)}> < span className="highlight">🔐 - Login </span></Nav.Link>
                <Nav.Link className="custom-nav-link" as={Link} to="/sign-up" onClick={() => setShowOffcanvas(false)}> 🖋️ - Sign Up </Nav.Link>
              </>
            ) : (
              <>
                <Offcanvas.Title>< span className="highlight">{currentUser.name}</span></Offcanvas.Title>
                <Nav.Link className="custom-nav-link" as={Link} to="/saved" onClick={() => setShowOffcanvas(false)}>❤️ Favourites</Nav.Link>
                <Nav.Link className="custom-nav-link" as={Link} to="#/messages" onClick={() => setShowOffcanvas(false)}>💰 Bids</Nav.Link>
                <Nav.Link className="custom-nav-link" as={Link} to="/settings" onClick={() => setShowOffcanvas(false)}>⚙️ Settings</Nav.Link>
                <Nav.Link className="custom-nav-link" as="button" onClick={handleLogout}>< span className="highlight">🔓 Logout</span></Nav.Link>
              </>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </Navbar>
    </>
  );
};

export default NavbarCustom;

