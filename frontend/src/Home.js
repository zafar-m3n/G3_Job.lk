import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Header from "./components/Header";
import ServiceCarousel from "./components/ServiceCarousel";
import ReviewCarousel from "./components/ReviewCarousel";
import Footer from "./components/Footer";

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

  const serviceGroups = chunkServices(services, 3);

  const reviews = [
    {
      name: "Ryan Reynolds",
      title: "Owner of mintmobile.com",
      review:
        "JOB.LK is the Deadpool of freelancing - cheeky, bold, and effective. Finding freelancers is smooth and fun. Don't miss out on this freelancing party. #FreelanceLikeDeadpool",
      image: "/images/ryan-reynolds.jpg",
    },
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
      name: "Optimus Prime",
      title: "Leader of Autobots",
      review:
        "Job.lk transforms the hiring battlefield. As an employer, it’s my Autobot ally in recruiting skilled developers. Together, we ensure a future of success and innovation.",
      image: "/images/optimus.jpg",
    },
  ];
  const userData = {};
  return (
    <>
      <Header userData={userData} />
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
        <ServiceCarousel serviceGroups={serviceGroups} />
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
            <ReviewCarousel reviews={reviews} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Home;
