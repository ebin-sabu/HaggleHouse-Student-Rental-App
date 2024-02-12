import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { currentUser, logout } = useAuth();

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Profile Settings</Card.Title>
                    <Card.Text>
                        <strong>Name:</strong> {currentUser?.name}
                    </Card.Text>
                    <Card.Text>
                        <strong>Email:</strong> {currentUser?.email}
                    </Card.Text>
                    <Button variant="warning" onClick={logout}>Logout</Button>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Settings;
