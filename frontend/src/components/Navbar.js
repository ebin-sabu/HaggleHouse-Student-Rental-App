import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useAuth } from '../context/AuthContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import GroupsIcon from '@mui/icons-material/Groups';

const NavbarCustom = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowOffcanvas(false);
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
            <span as={Link} to="/"><h1 className='title'>< span className="highlight">H</span>aggle<span className="highlight">H</span>ouse</h1> </span>
          </Nav>

          {/* Offcanvas Toggle Button (visible on XS to MD screens) */}
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(true)} className="d-lg-none" />

          {/* Navigation Links and Actions (visible on LG screens and up) */}
          <Nav className="ms-auto d-none d-lg-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Button variant="warning" as={Link} to="/login" className="me-2" style={{ fontFamily: "Poppins", fontWeight: 600, color: "#1C2541" }}>Login</Button>
                <Button variant="light" as={Link} to="/sign-up" style={{ fontFamily: "Poppins", fontWeight: 600, color: "#1C2541" }} >Sign-Up</Button>
              </>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle variant="warning" style={{ fontFamily: "Poppins", fontWeight: 500, margin: 5, backgroundColor: '#F6AE2D' }} id="dropdown-basic" className="text-nowrap ms-2">
                  <Image src={currentUser.profilePicUrl || '/path/to/default/profile.png'} roundedCircle width="30" height="30" className="me-2 image-fit-cover2" style={{ fontFamily: "Poppins" }} />
                  <span style={{ fontFamily: "Poppins" }}>{currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/" style={{ fontFamily: "Poppins", fontWeight: 600 }}><KeyboardBackspaceIcon />  Home</Dropdown.Item>
                  <Dropdown.Divider />
                  {currentUser.landlord ? (
                    <>
                      <Dropdown.Item as={Link} to="/my-properties" style={{ fontFamily: "Poppins", fontWeight: 500 }} ><HomeWorkIcon /> My Properties</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/create-property" style={{ fontFamily: "Poppins", fontWeight: 500 }}><AddHomeWorkIcon /> Add Property</Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <Dropdown.Item as={Link} to="/saved" style={{ fontFamily: "Poppins", fontWeight: 500 }}><FavoriteIcon />  Favourites</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/myBids" style={{ fontFamily: "Poppins", fontWeight: 500 }}><PriceChangeIcon /> Bids</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/groups" style={{ fontFamily: "Poppins", fontWeight: 500 }}><GroupsIcon /> Groups</Dropdown.Item>
                    </>
                  )}
                  <Dropdown.Item as={Link} to="/settings" style={{ fontFamily: "Poppins", fontWeight: 500 }}><SettingsIcon /> Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} style={{ fontFamily: "Poppins", fontWeight: 600 }}><ExitToAppIcon /> Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

          </Nav>
        </Container>

        {/* Offcanvas (visible on XS to MD screens when toggled) */}
        <Offcanvas scroll="false" backdrop="true" show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="custom-offcanvas-dark">
          <Offcanvas.Header closeButton>
            <Button className="d-grid gap-2" variant="dark" size="sm" disabled>Menu</Button>
          </Offcanvas.Header>
          <Offcanvas.Body>

            {!isAuthenticated ? (
              <>
                <Nav.Link className="custom-nav-link" as={Link} to="/login" onClick={() => setShowOffcanvas(false)} style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: '1.5rem', margin: 20 }}><LoginIcon /> Login</Nav.Link>
                <Nav.Link className="custom-nav-link" as={Link} to="/sign-up" onClick={() => setShowOffcanvas(false)} style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: '1.5rem', margin: 20 }}><AppRegistrationIcon /> Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Image src={currentUser.profilePicUrl || '/path/to/default/profile.png'} roundedCircle width="50" height="50" className="mx-auto d-block mb-3 image-fit-cover" />
                <Offcanvas.Title><span className="highlight" style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: '1.5rem' }}>{currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1)}</span></Offcanvas.Title>

                <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/" onClick={() => setShowOffcanvas(false)}><KeyboardBackspaceIcon /> Home</Nav.Link>
                {currentUser.landlord ? (
                  <>
                    <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/my-properties" onClick={() => setShowOffcanvas(false)}><HomeWorkIcon /> My Properties</Nav.Link>
                    <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/create-property" onClick={() => setShowOffcanvas(false)}><AddHomeWorkIcon /> Add Property</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/saved" onClick={() => setShowOffcanvas(false)}><FavoriteIcon /> Favourites</Nav.Link>
                    <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/myBids" onClick={() => setShowOffcanvas(false)}><PriceChangeIcon /> Bids</Nav.Link>
                    <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/groups" onClick={() => setShowOffcanvas(false)}><GroupsIcon /> Groups</Nav.Link>
                  </>
                )}
                <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as={Link} to="/settings" onClick={() => setShowOffcanvas(false)}><SettingsIcon /> Settings</Nav.Link>
                <Nav.Link className="custom-nav-link" style={{ fontFamily: "Poppins", fontWeight: 600 }} as="button" onClick={handleLogout}><span className="highlight"><ExitToAppIcon /> Logout</span></Nav.Link>
              </>
            )}
          </Offcanvas.Body>
        </Offcanvas>

      </Navbar>
    </>
  );
};

export default NavbarCustom;

