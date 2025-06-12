import { Col, Container, Row } from 'react-bootstrap'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FiPhone } from 'react-icons/fi'
import { MdOutlineMail } from 'react-icons/md'
import { Link } from 'react-router-dom'

const MyFooter = () => {
  return (
    <Container
      fluid
      className="footer-color font text-color p-5 pb-2 mb-2 shadow-footer"
    >
      <Row className="text-center text-md-start">
        <Col md={3} className="mb-4 mb-md-0">
          <Link className="nav-link fw-semibold" to="/">
            Biscottificio Castroreale S.r.l
          </Link>
          <Link className="nav-link" to="/">
            Via Castroreale, 0
          </Link>
          <Link className="nav-link" to="/">
            Sicilia, Castroreale (ME)
          </Link>
          <Link className="nav-link" to="/">
            P.IVA 123456789
          </Link>
          <Link
            className="nav-link d-flex align-items-center justify-content-center justify-content-md-start mt-4"
            to="/"
          >
            <MdOutlineMail size={20} className="me-2 fw-bold" />
            info@biscottificio.com
          </Link>
          <Link
            className="nav-link d-flex align-items-center justify-content-center justify-content-md-start"
            to="/"
          >
            <FiPhone size={20} className="me-2 fw-bold" />
            +39 333 000 1212
          </Link>
        </Col>

        <Col md={2} className="mb-4 mb-md-0">
          <Link className="nav-link mb-1" to="/">
            Home
          </Link>
          <Link className="nav-link mb-1" to="/products">
            Prodotti
          </Link>
          <Link className="nav-link mb-1" to="/about">
            Contatti
          </Link>
          <Link className="nav-link mb-1" to="/products">
            Compra
          </Link>
        </Col>

        <Col md={2} className="mb-4 mb-md-0">
          <Link className="nav-link mb-1" to="/">
            Privacy Policy
          </Link>
          <Link className="nav-link mb-1" to="/">
            Termini e Condizioni
          </Link>
          <Link className="nav-link mb-1" to="/">
            Cookie policy
          </Link>
        </Col>

        <Col md={2} className="mb-4 mb-md-0">
          <h5 className="fw-semibold mb-3">Social</h5>
          <div className="d-flex justify-content-center justify-content-md-start gap-4">
            <Link to="/" className="text-dark">
              <FaFacebook size={25} />
            </Link>
            <Link to="/" className="text-dark">
              <FaInstagram size={25} />
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        <Col
          md={12}
          className="d-flex justify-content-center justify-content-md-end mt-4"
        >
          <p className="text-muted m-0 me-3">
            &copy;{new Date().getFullYear()} Michele Mandanici
          </p>
        </Col>
      </Row>

      <hr className="border-2 border-black w-100 mt-3" />
    </Container>
  )
}

export default MyFooter
