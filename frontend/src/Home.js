import React from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Row,
  Col,
  Carousel,
  Card,
} from "react-bootstrap";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

function Home() {
  const services = [
    { name: "UI/UX Design", image: "/uiux-designer.jpg" },
    { name: "Full Stack Development", image: "/fullstack-dev.jpg" },
    { name: "QA Engineering", image: "/qa-engineer.jpg" },
    { name: "Project Management", image: "/project-manager.jpg" },
    { name: "Front-End Development", image: "/frontend-dev.jpg" },
    { name: "Back-End Development", image: "/backend-dev.jpg" },
    { name: "E-Commerce Development", image: "/ecommerce-dev.jpg" },
    {
      name: "Mobile Responsive Design",
      image: "/mobile-design.jpg",
    },
  ];
  const chunkServices = (arr, size) =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkServices(arr.slice(size), size)]
      : [arr];

  const serviceGroups = chunkServices(services, 4);

  return (
    <>
      <Navbar className="w-100">
        <Container fluid>
          {/* Logo */}
          <Navbar.Brand href="/" className="fs-3 logo-font">
            Job.lk
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Navigation and Action Buttons */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-center"
          >
            {/* Navigation Links */}
            <Nav>
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="#jobs">Jobs</Nav.Link>
              <Nav.Link href="#freelancers">Freelancers</Nav.Link>
              <Nav.Link href="#how-it-works">How it works?</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          {/* Action Buttons */}
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Sign Up</Nav.Link>
            <Button className="custom-primary-btn">Contact Us</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="px-0 mx-0">
        <Row className="align-items-center justify-content-between ps-5">
          <Col md={7}>
            <h1>Empowering Freelancers, Fuelling Dreams</h1>
            <p style={{ fontSize: 18 }}>
              Join our platform to discover your potential and begin your
              freelancing journey
            </p>
            <Button className="custom-primary-btn get-started-btn">
              Get Started
            </Button>
          </Col>

          <Col md={4}>
            <img src="/bkg.png" alt="Hero" className="img-fluid m-0" />
          </Col>
        </Row>
      </Container>

      <Container fluid className="my-5 px-5">
        <h1 className="mb-4">Popular Services</h1>
        <Carousel
          indicators={false}
          interval={null}
          prevIcon={
            <span className="carousel-control-prev">
              <FaArrowAltCircleLeft size={30} />
            </span>
          }
          nextIcon={
            <span className="carousel-control-next">
              <FaArrowAltCircleRight size={30} />
            </span>
          }
          className="custom-carousel"
        >
          {serviceGroups.map((group, idx) => (
            <Carousel.Item key={idx}>
              <Row>
                {group.map((service, index) => (
                  <Col
                    key={index}
                    md={3}
                    className="d-flex justify-content-center"
                  >
                    <Card style={{ width: "250px" }}>
                      <Card.Img variant="top" src={service.image} />
                      <Card.Body>
                        <Card.Title className="card-title-custom">
                          {service.name}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      <Container fluid className="my-5 px-5 third-section"></Container>
    </>
  );
}

export default Home;
