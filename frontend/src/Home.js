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
  Form,
} from "react-bootstrap";

function Home() {
  const services = [
    { name: "UI/UX Design", image: "/images/uiux-designer.jpg" },
    { name: "Full Stack Development", image: "/images/fullstack-dev.jpg" },
    { name: "QA Engineering", image: "/images/qa-engineer.jpg" },
    { name: "Project Management", image: "/images/project-manager.jpg" },
    { name: "Front-End Development", image: "/images/frontend-dev.jpg" },
    { name: "Back-End Development", image: "/images/backend-dev.jpg" },
    { name: "E-Commerce Development", image: "/images/ecommerce-dev.jpg" },
    {
      name: "Mobile Responsive Design",
      image: "/images/mobile-design.jpg",
    },
  ];
  const chunkServices = (arr, size) =>
    arr.length > size
      ? [arr.slice(0, size), ...chunkServices(arr.slice(size), size)]
      : [arr];

  const serviceGroups = chunkServices(services, 4);

  const reviews = [
    {
      name: "John Cena",
      title: "Frontend Web Developer",
      review:
        "You can't see me, but you can see my success on Job.lk! It's a champion's ring for freelancers, where hustle, loyalty, and respect lead to victory!",
      image: "/images/john-cena.jpg",
    },
    {
      name: "Bruce Wayne",
      title: "Fullstack Web Developer",
      review:
        "In the shadows of Gotham, I found Job.lk. Efficient, reliable, a beacon in the night for freelancers seeking justice in opportunities. It's my trusted ally. Not the freelancing site we needed, but the freelancing site we deserve.",
      image: "/images/bruce-wayne.jpg",
    },
    {
      name: "Ryan Reynolds",
      title: "Owner of mintmobile.com",
      review:
        "JOB.LK is the Deadpool of freelancing - cheeky, bold, and effective. Finding freelancers is smooth and fun. Don't miss out on this freelancing party. #FreelanceLikeDeadpool",
      image: "/images/ryan-reynolds.jpg",
    },
    {
      name: "Optimus Prime",
      title: "Leader of Autobots",
      review:
        "Job.lk transforms the hiring battlefield. As an employer, it’s my Autobot ally in recruiting skilled developers. Together, we ensure a future of success and innovation.",
      image: "/images/optimus.jpg",
    },
  ];

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
            <img src="/images/bkg.png" alt="Hero" className="img-fluid m-0" />
          </Col>
        </Row>
      </Container>

      <Container fluid className="my-5 px-5">
        <h1 className="mb-4">Popular Services</h1>
        <Carousel
          indicators={false}
          interval={null}
          prevIcon={
            <span aria-hidden="true" className="carousel-control-prev-icon">
              <i className="fas fa-arrow-circle-left fa-2x"></i>
            </span>
          }
          nextIcon={
            <span aria-hidden="true" className="carousel-control-next-icon">
              <i className="fas fa-arrow-circle-right fa-2x"></i>
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

      <Container fluid className="my-5 p-5 third-section">
        <Row className="justify-content-between m-0 list-section">
          <Col md={5} className="p-0 list-section align-items-center">
            <h1 className="mb-4 heading">The best part? Everything.</h1>
            <ul className="list-unstyled bg-transparent list-section">
              <li className="mb-2 list-section">
                <i class="fa-regular fa-circle-check list-section me-2"></i>{" "}
                Stick to your budget
                <p className="list-section">
                  Find the right service for every price point. No hourly rates,
                  just project-based pricing.
                </p>
              </li>
              <li className="mb-2 list-section">
                <i class="fa-regular fa-circle-check list-section me-2"></i> Get
                quality work done quickly
                <p className="list-section">
                  Hand your project over to a talented freelancer in minutes,
                  get long-lasting results.
                </p>
              </li>
              <li className="mb-2 list-section">
                <i class="fa-regular fa-circle-check list-section me-2"></i> Pay
                when you're happy
                <p className="list-section">
                  Upfront quotes mean no surprises. Payments only get released
                  when you approve.
                </p>
              </li>
              <li className="mb-2 list-section">
                <i class="fa-regular fa-circle-check list-section me-2"></i>
                Count on 24/7 support
                <p className="list-section">
                  Our round-the-clock support team is available to help anytime,
                  anywhere.
                </p>
              </li>
            </ul>
          </Col>

          <Col md={6} className="p-0 bg-transparent d-flex justify-content-end">
            <img
              src="/images/corporate-workers.jpg"
              alt="Corporate Workers"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>

      <Container fluid className="my-5 px-5 fourth-section">
        <h1 className="mb-4 heading text-center">What our customers say</h1>
        <Row>
          <Col md={6} className="mx-auto">
            <Carousel
              indicators={false}
              interval={null}
              prevIcon={
                <span aria-hidden="true" className="carousel-control-prev-icon">
                  <i className="fas fa-arrow-circle-left fa-2x"></i>
                </span>
              }
              nextIcon={
                <span aria-hidden="true" className="carousel-control-next-icon">
                  <i className="fas fa-arrow-circle-right fa-2x"></i>
                </span>
              }
              className="custom-carousel"
            >
              {reviews.map((review, index) => (
                <Carousel.Item>
                  <Row>
                    <Col
                      key={index}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Card style={{ width: "500px" }} className="text-center">
                        <Card.Header className="p-2 bg-transparent border-0">
                          <Card.Img
                            variant="top"
                            src={review.image}
                            className="rounded-circle mx-auto"
                            style={{ width: "100px", height: "100px" }}
                          />
                        </Card.Header>
                        <Card.Body className="p-2">
                          <Card.Title>{review.name}</Card.Title>
                          <Card.Subtitle className="mb-2">
                            {review.title}
                          </Card.Subtitle>
                          <Card.Text>{review.review}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>

      <Container fluid className="mt-5 px-5 py-3 fifth-section">
        <Row className="bg-transparent">
          {/* First Column - Logo and About */}
          <Col md={5} className="mx-auto mb-3 bg-transparent">
            <Navbar.Brand href="/" className="fs-3 footer-logo bg-transparent">
              Job.lk
            </Navbar.Brand>
            <p className="footer-content">
              Job.lk is a specialized freelance platform tailored for web
              developer freelancers in Sri Lanka. Our platform serves as a
              dynamic marketplace, connecting talented web developers with a
              diverse range of opportunities. Whether you are a skilled web
              developer seeking exciting projects or an employer searching for
              top-notch web development expertise, Job.lk is your go-to
              destination. Discover the perfect match for your project or
              showcase your skills to a local and global audience, all on
              Job.lk, the premier choice for web development freelancers in Sri
              Lanka.
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

        <h5 className="footer-content text-center">
          CCG3 All Rights Reserved.
        </h5>
      </Container>
    </>
  );
}

export default Home;
