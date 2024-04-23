import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const FooterCustom = () => {
    return (
        <footer className="bg-dark text-white mt-5" style={{ fontFamily: "Poppins", color: "#1C2541" }}>
            <Container fluid className="py-3">
                <Row>
                    <Col className="text-center py-3">
                        &copy; {new Date().getFullYear()} <span style={{ fontFamily: "Poppins", fontWeight: 500, color: "#F6AE2D" }}>HaggleHouse</span> - All Rights Reserved
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center py-1" >
                        <Nav.Link href="https://ebinsabu.com/" className="text-white">
                            Made by <span style={{ fontFamily: "Poppins", fontWeight: 500, color: "#F6AE2D" }}>Ebin Pereppadan Sabu.</span>
                        </Nav.Link>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterCustom;
