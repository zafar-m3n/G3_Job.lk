import React from "react";
import { Carousel, Row, Col, Card } from "react-bootstrap";

function ServiceCarousel({ serviceGroups }) {
  return (
    <Carousel
      indicators={false}
      interval={null}
      prevIcon={
        <span
          aria-hidden="true"
          className="carousel-control-prev-icon"
          style={{
            position: "absolute",
            left: "calc(25% - 24px)", // Adjusting for icon size
            zIndex: 1,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <i className="fas fa-arrow-circle-left fa-2x"></i>
        </span>
      }
      nextIcon={
        <span
          aria-hidden="true"
          className="carousel-control-next-icon"
          style={{
            position: "absolute",
            right: "calc(25% - 24px)", // Adjusting for icon size
            zIndex: 1,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <i className="fas fa-arrow-circle-right fa-2x"></i>
        </span>
      }
      className="py-2"
    >
      {serviceGroups.map((group, idx) => (
        <Carousel.Item key={idx}>
          <Row className="justify-content-center">
            {group.map((service, index) => (
              <Col key={index} md={3} className="d-flex justify-content-center">
                <Card>
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
  );
}

export default ServiceCarousel;
