import React from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Form,
  Button,
} from "react-bootstrap";

function Footer() {
  return (
    <Container fluid className="px-5 py-3 fifth-section">
      <Row className="bg-transparent">
        {/* First Column - Logo and About */}
        <Col md={5} className="mx-auto mb-3 bg-transparent">
          <Navbar.Brand href="/" className="fs-3 footer-logo bg-transparent">
            Job.lk
          </Navbar.Brand>
          <p className="footer-content">
            Job.lk is a specialized freelance platform tailored for web
            developer freelancers in Sri Lanka. Our platform serves as a dynamic
            marketplace, connecting talented web developers with a diverse range
            of opportunities. Whether you are a skilled web developer seeking
            exciting projects or an employer searching for top-notch web
            development expertise, Job.lk is your go-to destination. Discover
            the perfect match for your project or showcase your skills to a
            local and global audience, all on Job.lk, the premier choice for web
            development freelancers in Sri Lanka.
          </p>
        </Col>

        {/* Second Column - Quick Links */}
        <Col md={3} className="mx-auto mb-3 bg-transparent">
          <h5 className="footer-content">Quick Links</h5>
          <Nav className="footer-content">
            <Col className="footer-content">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#jobs">Jobs</Nav.Link>
              <Nav.Link href="#freelancers">Freelancers</Nav.Link>
              <Nav.Link href="#how-it-works">How it works?</Nav.Link>
            </Col>
          </Nav>
        </Col>

        {/* Third Column - Contact / Subscription Form */}
        <Col md={3} className="mx-auto mb-3 bg-transparent">
          <h5 className="footer-content">Get in touch</h5>
          <Form className="footer-content">
            <Form.Group className="mb-3 rounded" controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group className="mb-3 rounded" controlId="formBasicName">
              <Form.Control type="text" placeholder="Your Name" />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="custom-primary-btn"
            >
              Subscribe
            </Button>
          </Form>
        </Col>
      </Row>

      <h5 className="footer-content text-center">CCG3 All Rights Reserved.</h5>
    </Container>
  );
}

export default Footer;
