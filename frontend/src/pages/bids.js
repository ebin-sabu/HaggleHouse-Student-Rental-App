import React, { useState, useEffect } from 'react';
import { getAllBidsForUser } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Typography, Paper, Box, List, ListItem, ListItemText, Button, Chip } from '@mui/material';
import { Container } from 'react-bootstrap';
import Popup from '../components/Popup';
import { format } from 'date-fns'; // Importing format function for date formatting
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const StatusLegend = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
        <Chip label="Pending" sx={{ fontFamily: "Poppins", bgcolor: '#2b3035', color: 'white' }} />
        <Chip label="Accepted" sx={{ fontFamily: "Poppins", bgcolor: '#2f7c31', color: 'white' }} />
        <Chip label="Rejected" sx={{ fontFamily: "Poppins", bgcolor: '#d32f2f', color: 'white' }} />
    </Box>
);

const Bids = () => {
    const [bids, setBids] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [currentBidDetails, setCurrentBidDetails] = useState({});
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const fetchedBids = await getAllBidsForUser(currentUser.id);
                const formattedBids = fetchedBids.map(bid => ({
                    ...bid,
                    createdAt: format(new Date(bid.createdAt), 'PPp'), // Formatting date
                    isCurrentUserBid: bid.user.id === currentUser.id, // Check if the current user placed the bid
                }));

                // Sort bids by status ('ACCEPTED', 'REJECTED', 'PENDING') and within each status by createdAt date
                const sortedBids = formattedBids.sort((a, b) => {
                    const statusOrder = { 'ACCEPTED': 1, 'REJECTED': 2, 'PENDING': 3 };
                    const statusComparison = statusOrder[a.status] - statusOrder[b.status];
                    if (statusComparison !== 0) return statusComparison;
                    return new Date(b.createdAt) - new Date(a.createdAt); // Assuming later dates should come first, swap a and b for the opposite
                });

                setBids(sortedBids);
            } catch (error) {
                console.error('Failed to fetch bids:', error);
            }
        };

        if (currentUser) {
            fetchBids();
        }
    }, [currentUser]);


    const handleViewDetails = (bid) => {
        setCurrentBidDetails(bid);
        setShowPopup(true);
    };

    const getBorderColor = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return '#2f7c31';
            case 'REJECTED':
                return '#d32f2f';
            case 'PENDING':
            default:
                return '#2b3035';
        }
    };

    return (
        <Container className="custom-container" style={{ minHeight: 400 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>My Bids</h2>
            <Box sx={{ margin: '20px' }}>
                <StatusLegend />
                <List>
                    {bids.length > 0 ? (
                        bids.map((bid) => (
                            <Paper
                                key={bid.id}
                                elevation={0}
                                sx={{
                                    margin: { xs: '8px', sm: '10px' }, // Smaller margin on extra-small devices, larger margin starting from small devices
                                    padding: { xs: '5px', sm: '10px' }, // Adjust padding similarly
                                    backgroundColor: `${getBorderColor(bid.status)}`,
                                    border: '2px solid grey',
                                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                                    '&:hover': { boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)' },
                                    display: 'flex', // Ensure elements inside Paper are flexibly laid out
                                    flexDirection: { xs: 'column', sm: 'row' }, // Stack elements vertically on small screens, align side-by-side on larger screens
                                    alignItems: 'center', // Align items in the center for better visual alignment, especially on smaller screens
                                }}
                            >
                                <ListItem alignItems="flex-start">
                                    <Box sx={{ width: '100%' }}>
                                        <Typography component="div" variant="subtitle1" sx={{
                                            fontWeight: 500,
                                            fontFamily: "Poppins", fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                                            color: '#E2DFD2' // Smaller font size on xs screens, larger on sm screens and above
                                        }}>
                                            {bid.property.title}  <span style={{ fontFamily: "Poppins", fontWeight: 400, fontStyle: 'italic', color: 'grey' }}> {bid.isCurrentUserBid ? "" : "- Placed by " + bid.user.name}</span>
                                        </Typography>

                                        <Box component="hr" sx={{
                                            color: 'white',
                                            border: 'none',
                                            borderBottom: '4px dotted',
                                            marginTop: '5px',
                                            marginBottom: '5px',
                                        }} />
                                        <Typography component="div" variant="body2" sx={{ color: '#E2DFD2', display: 'block', fontSize: { xs: '0.75rem', sm: '0.9rem' } }}>
                                            Bid Amount: <span style={{ fontWeight: 'bold' }}>£{bid.amount}</span><br />
                                            <span style={{ color: '#EDEADE', fontSize: '0.7rem', fontWeight: 500 }}>on {bid.createdAt}<br /></span>
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleViewDetails(bid)}
                                        size="small" // Make the button smaller
                                        sx={{
                                            mr: 1, // Keeps the button aligned at the bottom of the ListItem
                                            bgcolor: '#f8f9fa', color: 'black', border: "grey", '&:hover': { bgcolor: '#2b3035', color: 'white', boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)' },
                                            fontSize: '0.75rem',
                                            fontFamily: "Poppins",
                                        }}
                                    >
                                        More Info
                                    </Button>
                                </ListItem>
                            </Paper>
                        ))
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography style={{ fontFamily: "Poppins", fontSize: '15px', fontWeight: '600', color: '#1C2541' }}>No Bids Have Been Made.</Typography>
                        </Box>
                    )}
                </List>
            </Box>
            {showPopup && (
                <Popup
                    show={showPopup}
                    onHide={() => setShowPopup(false)}
                    title={currentBidDetails.property?.title}
                    images={currentBidDetails.property?.images}
                    price={currentBidDetails.amount}
                    address={currentBidDetails.property?.address}
                    city={currentBidDetails.property?.city}
                    country={currentBidDetails.property?.country}
                    propertyId={currentBidDetails.propertyId}
                    description={currentBidDetails.property?.description}
                    facilities={currentBidDetails.property?.facilities}
                    bid={currentBidDetails}
                    deadline={currentBidDetails.property?.deadline}
                    live={currentBidDetails.property?.live}
                />
            )}
        </Container>
    );
};

export default Bids;
