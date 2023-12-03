import React from "react";
import { Carousel, Row, Col, Card } from "react-bootstrap";

function ReviewCarousel({ reviews }) {
  return (
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
        <Carousel.Item key={index}>
          <Row>
            <Col className="d-flex justify-content-center align-items-center">
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
                  <Card.Subtitle className="mb-2">{review.title}</Card.Subtitle>
                  <Card.Text>{review.review}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ReviewCarousel;
