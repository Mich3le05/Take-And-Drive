import { useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/images/logo2.png'
import { CgProfile } from 'react-icons/cg'

const MyNav = () => {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="nav-color py-0 shadow-nav fixed-top z-3"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
      onSelect={() => setExpanded(false)}
    >
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          onClick={() => setExpanded(false)}
        >
          <img src={logo} alt="logo" className="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav" className="">
          <Nav className="mx-auto">
            <Link
              className={`nav-link text-color fw-semibold fs-5 ${
                location.pathname === '/' ? 'active' : ''
              }`}
              to="/"
              onClick={() => setExpanded(false)}
            >
              Home
            </Link>
            <Link
              className={`nav-link text-color fw-semibold fs-5 ${
                location.pathname === '/vehicles' ? 'active' : ''
              }`}
              to="/vehicles"
              onClick={() => setExpanded(false)}
            >
              Vehicles
            </Link>
            <Link
              className={`nav-link text-color fw-semibold fs-5 ${
                location.pathname === '/contacts' ? 'active' : ''
              }`}
              to="/contacts"
              onClick={() => setExpanded(false)}
            >
              Contacts
            </Link>
            <Link
              className={`nav-link text-color fw-semibold fs-5 ${
                location.pathname === '/operation' ? 'active' : ''
              }`}
              to="/operation"
              onClick={() => setExpanded(false)}
            >
              How it works
            </Link>
          </Nav>
          <Nav>
            <Link
              className={`nav-link text-color fw-semibold fs-5 ${
                location.pathname === '/profile' ? 'active' : ''
              }`}
              to="/profile"
              onClick={() => setExpanded(false)}
            >
              <CgProfile size={25} />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNav
