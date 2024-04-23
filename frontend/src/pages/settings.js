import React from 'react';
import { Container, Card, Button, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Settings = () => {
    const { currentUser, logout: logoutFn } = useAuth();

    const navigate = useNavigate();

    const logout = () => {
        logoutFn();
        navigate('/');
    };

    return (
        <Container className="custom-container">
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            <Row className="my-4 justify-content-center">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{ gap: '1rem', fontFamily: "Poppins" }} // Add space between items
                >
                    <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Profile Settings</h2>
                    <Card style={{ fontFamily: "Poppins", width: '18rem', textAlign: 'center', backgroundColor: '#f8f9fa', border: 0 }}> {/* Added textAlign style for centering content */}
                        <Card.Body>
                            {/* Added mx-auto for centering Image and d-block to make it a block-level element */}
                            <Image src={currentUser?.profilePicUrl || 'path/to/default/image.jpg'} roundedCircle width="200" height="200" className="mx-auto d-block mb-3 image-fit-cover" />
                            <Card.Text>
                                <span style={{ fontFamily: "Poppins", fontWeight: 600 }} >Name:</span> {currentUser?.name.charAt(0).toUpperCase() + currentUser?.name.slice(1)}
                            </Card.Text>
                            <Card.Text>
                                <span style={{ fontFamily: "Poppins", fontWeight: 600 }} >Email:</span> {currentUser?.email}
                            </Card.Text>
                            <Card.Text>
                                <span style={{ fontFamily: "Poppins", fontWeight: 600 }} >User Type:</span> {currentUser?.landlord ? "Landlord" : "Student"}
                            </Card.Text>

                            <Button variant="warning" style={{ fontFamily: "Poppins", fontWeight: 500, margin: 5 }} onClick={logout}>Logout</Button>
                        </Card.Body>
                    </Card>
                </Box>
            </Row>
        </Container>
    );
};

export default Settings;


