import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const NavbarCustom = () => {

  return (

    <Navbar expand="lg" sticky="top" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="/">
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
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="ms-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav className="me-auto">
              <Link to="/login"><h2>Login</h2></Link>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  )
}

export default NavbarCustom;