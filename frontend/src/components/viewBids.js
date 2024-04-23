import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { acceptBid, rejectBid, getBidsForProperty, getPropertyDetails, updateProperty } from '../api/axios'; // Assume these API functions are properly defined
import { Typography, Paper, Box, List, ListItem, Button, Chip, Dialog, DialogTitle } from '@mui/material';
import { Container } from 'react-bootstrap';
import { format } from 'date-fns';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const StatusLegend = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 2 }}>
        <Chip label="Pending" sx={{ fontFamily: "Poppins", bgcolor: '#1C2541', color: 'white' }} />
        <Chip label="Accepted" sx={{ fontFamily: "Poppins", bgcolor: '#2f7c31', color: 'white' }} />
        <Chip label="Rejected" sx={{ fontFamily: "Poppins", bgcolor: '#d32f2f', color: 'white' }} />
    </Box>
);

function ViewBids() {
    const { propertyId } = useParams();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagePopupOpen, setMessagePopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBids();
    }, [propertyId]);

    const fetchBids = async () => {
        setLoading(true);
        try {
            const fetchedBids = await getBidsForProperty(propertyId);
            const sortedBids = fetchedBids
                .map(bid => ({
                    ...bid,
                    createdAt: format(new Date(bid.createdAt), 'PPp'),
                    displayCreatedAt: format(new Date(bid.createdAt), 'PPp'),
                    groupSize: bid.group ? bid.group.numberOfPeople : 1, // Default to 1 if no group
                }))
                .sort((a, b) => {
                    if (a.status === 'ACCEPTED' && b.status !== 'ACCEPTED') return -1;
                    if (b.status === 'ACCEPTED' && a.status !== 'ACCEPTED') return 1;
                    if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
                    if (b.status === 'PENDING' && a.status !== 'PENDING') return 1;
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
            setBids(sortedBids);
        } catch (error) {
            console.error('Failed to fetch bids:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptBid = async (bidId, groupSize) => {
        const propertyDetails = await getPropertyDetails(propertyId);
        if (groupSize > propertyDetails.availableRooms) {
            alert('Cannot accept this bid, group size exceeds available rooms.');
            return;
        }
        try {
            await acceptBid(bidId);
            const newAvailableRooms = propertyDetails.availableRooms - groupSize;
            await updateProperty(propertyId, { availableRooms: newAvailableRooms });
            if (newAvailableRooms === 0) {
                // Optionally handle logic to disable further bids
            }
            fetchBids();
        } catch (error) {
            console.error('Failed to accept bid:', error);
        }
    };

    const handleRejectBid = async (bidId) => {
        try {
            await rejectBid(bidId);
            fetchBids();
        } catch (error) {
            console.error('Failed to reject bid:', error);
        }
    };

    const toggleMessagePopup = () => {
        setMessagePopupOpen(!messagePopupOpen);
    };

    if (loading) return <Typography>Loading bids...</Typography>;

    return (
        <Container className="custom-container" style={{ minHeight: 400 }}>
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Bids on Property</h2>
            <Box sx={{ margin: '20px' }}>
                <StatusLegend />
                <List>
                    {bids.length > 0 ? bids.map((bid) => (
                        <Paper
                            key={bid.id}
                            elevation={0}
                            sx={{
                                margin: '10px',
                                padding: '10px',
                                border: `2px solid ${bid.status === 'ACCEPTED' ? '#2f7c31' : bid.status === 'REJECTED' ? '#d32f2f' : '#1C2541'}`,
                                '&:hover': { boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)' },
                            }}
                        >
                            <ListItem>
                                <Box sx={{ width: '100%' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 500, fontFamily: "Poppins" }}>
                                        Student: <span style={{ fontFamily: "Poppins", fontWeight: 700, color: "#f5ae2d" }}>{bid.user.name.charAt(0).toUpperCase() + bid.user.name.slice(1)}</span>
                                    </Typography>
                                    <Box component="hr" sx={{ border: 'none', borderBottom: '2px dotted', color: 'black', marginTop: '5px', marginBottom: '5px' }} />
                                    <Typography variant="body2" sx={{ fontFamily: "Poppins", color: 'grey' }}>
                                        {bid.displayCreatedAt}<br /><br />
                                    </Typography>
                                    {bid.groupSize > 0 && (
                                        <Typography variant="body2" sx={{ fontFamily: "Poppins", fontWeight: 500 }}>
                                            Group size:  <span style={{ fontFamily: "Poppins", fontWeight: 700 }}>{bid.groupSize}</span>
                                        </Typography>
                                    )}
                                    <Typography variant="body2" sx={{ fontFamily: "Poppins", fontWeight: 500 }}>
                                        Amount:  <span style={{ fontFamily: "Poppins", fontWeight: 700 }}>£{bid.amount}</span><br />
                                        <br />Status:  <span style={{ fontFamily: "Poppins", fontWeight: 700 }}>{bid.status}</span>
                                    </Typography>
                                </Box>
                            </ListItem>
                            {bid.status === 'PENDING' && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button variant="contained" color="success" onClick={() => handleAcceptBid(bid.id, bid.groupSize)} sx={{ fontFamily: "Poppins", fontWeight: 500 }}>
                                        Accept
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => handleRejectBid(bid.id)} sx={{ fontFamily: "Poppins", fontWeight: 500 }}>
                                        Reject
                                    </Button>
                                </Box>
                            )}
                            {bid.status === 'ACCEPTED' && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginTop: 2 }}>
                                    <Button variant="contained" onClick={toggleMessagePopup} sx={{ bgcolor: '#2b3035', color: 'white', '&:hover': { bgcolor: '#f8f9fa', color: 'black' }, fontFamily: "Poppins", fontWeight: 500, color: "white" }}>
                                        Send Message <SendIcon style={{ marginLeft: 10 }} />
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    )) : (
                        <Typography sx={{ fontFamily: "Poppins", textAlign: 'center' }}>No Bids Found for This Property.</Typography>
                    )}
                </List>
                <Dialog open={messagePopupOpen} onClose={toggleMessagePopup}>
                    <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 500, margin: 10 }}>Coming Soon...</DialogTitle>
                </Dialog>
            </Box>
        </Container>
    );
}

export default ViewBids;

