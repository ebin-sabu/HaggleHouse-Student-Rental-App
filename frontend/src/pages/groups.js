// groups.js
import React, { useState, useEffect } from 'react';
import { createGroup, joinGroup, leaveGroup, getGroupDetails } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarGroup, Box, Button, Container, TextField, Modal, Typography, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const GroupManagement = () => {
    const { currentUser } = useAuth();
    const [group, setGroup] = useState(null);
    const [joinCode, setJoinCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Only proceed if currentUser.id is defined
        if (currentUser?.id) {
            fetchGroupDetails();
        }
    }, [currentUser?.id]);

    const fetchGroupDetails = async () => {
        setIsLoading(true);
        try {
            const data = await getGroupDetails(currentUser.id);
            setGroup(data);
        } catch (error) {
            console.error("Failed to fetch group details:", error);
            setGroup(null); // Reset group state in case of error
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateGroup = async () => {
        try {
            const data = await createGroup({ userId: currentUser.id });
            setGroup(data);
        } catch (error) {
            console.error("Failed to create group:", error);
        }
    };

    const handleJoinGroup = async () => {
        try {
            const data = await joinGroup({ userId: currentUser.id, joinCode });
            setGroup(data);
        } catch (error) {
            console.error("Failed to join group:", error);
        }
    };

    const handleLeaveGroup = async () => {
        try {
            await leaveGroup(currentUser.id);
            setGroup(null); // Reset group state after leaving
        } catch (error) {
            console.error("Failed to leave group:", error);
        }
    };

    // State to control the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open modal and set selected user
    const handleAvatarClick = (user) => {
        setIsModalOpen(true);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Style for the modal
    const modalStyle = {
        fontFamily: "Poppins",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        border: '2px solid #2b3035',
        boxShadow: 24,
        p: 4,
        bgcolor: '#2b3035', // Dark background
        color: 'white', // White text
        borderRadius: '16px', // Rounded corners
    };

    return (
        <Container className="custom-container">
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            <Container style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {group ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        style={{ gap: '1rem', fontFamily: "Poppins" }} // Add space between items
                    >
                        <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Group Details</h2>
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" style={{ gap: '20px', fontFamily: "Poppins" }}>
                            <p style={{ fontFamily: "Poppins", fontWeight: 500 }}>Join Code: <strong>{group.joinCode}</strong></p>
                            <p style={{ fontFamily: "Poppins", fontWeight: 500 }}>Number of Members: {group.numberOfPeople}</p>
                        </Box>
                        <p style={{ fontFamily: "Poppins", fontWeight: 500 }}>Other Members:</p>
                        <AvatarGroup max={4}>
                            {group.users.filter(user => user.id !== currentUser.id).map((user) => (
                                <Avatar
                                    key={user.id}
                                    src={user.profilePicUrl}
                                    alt={user.name}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        border: '3px solid #ffc107',
                                        fontFamily: "Poppins"
                                    }}
                                    onClick={() => handleAvatarClick(user)} // Add click event to open modal
                                />
                            ))}
                        </AvatarGroup>
                        <Button variant="contained" sx={{ fontFamily: "Poppins", fontWeight: 600, mr: 1, bgcolor: '#2b3035', color: 'white', '&:hover': { bgcolor: 'white', color: 'black' } }} onClick={handleLeaveGroup} style={{ marginTop: '1rem' }}>
                            Leave Group
                        </Button>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ gap: '1rem', fontFamily: "Poppins" }}>
                        <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Join A Group</h2>
                        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" style={{ gap: '10px', fontFamily: "Poppins" }}>
                            <TextField
                                label="Enter Join Code"
                                sx={{ fontFamily: "Poppins" }}
                                variant="outlined"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                            />
                            <Button variant="contained" sx={{ fontFamily: "Poppins", mr: 1, bgcolor: '#2b3035', color: 'white', '&:hover': { bgcolor: '#f8f9fa', color: 'black' } }} onClick={handleJoinGroup}>
                                Join Group
                            </Button>
                        </Box>
                        <Button variant="contained" color="inherit" sx={{ fontFamily: "Poppins" }} onClick={handleCreateGroup}>
                            Create Group
                        </Button>
                    </Box>
                )
                }
                {/* Modal for displaying all group members */}
                <Modal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    aria-labelledby="group-members-title"
                    aria-describedby="group-members-description"
                >
                    <Box sx={modalStyle}>
                        <Button
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                minWidth: 'auto',
                                color: 'white'
                            }}
                            onClick={handleCloseModal}
                        >
                            <CloseIcon />
                        </Button>
                        <Typography id="modal-modal-title"
                            variant="h5"
                            component="h2"
                            color={'#F6AE2D'}
                            sx={{ textAlign: 'center', marginTop: '10px', marginBottom: '25px', fontFamily: "Poppins", fontWeight: 600 }}>
                            All Group Members
                        </Typography>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            group && group.users.map((user) => (
                                <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Avatar
                                        src={user.profilePicUrl}
                                        alt={user.name}
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            border: '2px solid #ffc107',
                                        }}
                                    />
                                    <Typography variant="body1" style={{ fontFamily: "Poppins", fontWeight: 500 }}>{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</Typography>
                                </Box>
                            ))
                        )}
                    </Box>
                </Modal>
            </Container>
            {!group ? (
                <p style={{ fontFamily: "Poppins", fontWeight: 400, fontSize: '0.8rem', color: "black", marginTop: 20, marginBottom: 50, textAlign: 'center' }}>
                    Landlords often prefer bids from groups, increasing your chances of acceptance.
                    Either enter a Join code or create a new group and invite your friends to get started!
                </p>
            ) : null}
        </Container >
    );

};

export default GroupManagement;
