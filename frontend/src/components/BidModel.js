import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useAuth } from '../context/AuthContext';
import { submitBid } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const BidModal = ({ open, handleClose, propertyId }) => {
    const [bidPrice, setBidPrice] = useState('');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleBidChange = (event) => {
        const newValue = event.target.value;
        // Ensure only numbers can be entered
        if (!isNaN(newValue) && newValue >= 0) {
            setBidPrice(newValue);
        }
    };

    const handleBidSubmit = async () => {
        if (bidPrice === '') {
            toast.error('Please enter a bid amount.');
            return;
        }

        const bidData = {
            userId: currentUser.id,
            propertyId,
            amount: bidPrice,
        };

        try {
            await submitBid(bidData);
            handleClose(); // Close modal on successful bid submission
            toast.success('Bid submitted successfully!');
            navigate('/myBids');
        } catch (error) {
            toast.error('Failed to submit bid: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <Modal
            show={open}
            onHide={handleClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            style={{ color: '#fff', backgroundColor: '#2b3035' }} // Apply dark mode styling here
        >
            <Modal.Header style={{ backgroundColor: '#2b3035', borderColor: '#343a40' }}>
                <Modal.Title id="contained-modal-title-vcenter" style={{ color: '#F6AE2D' }}>
                    Make A Bid
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: '#2b3035' }}>
                <p>Once a bid has been made, it cannot be deleted. Only one bid is allowed per property by you or your group.
                    Another bid cannot be made by you until the landlord either rejects or accepts your Bid. If the Landlord doesn't accept or reject a Bid,
                    the highest bid above the secret reservation price is accepted. Good Luck and choose a bid wisely,<br /><br /> Happy Haggling!
                </p>
                <InputGroup className="mb-3">
                    <InputGroup.Text style={{ backgroundColor: '#343a40', color: '#fff' }}>£</InputGroup.Text>
                    <Form.Control
                        aria-label="Bid amount"
                        value={bidPrice}
                        onChange={handleBidChange}
                        style={{ color: '#fff', backgroundColor: '#343a40' }}
                        type="number"
                        placeholder="Enter bid amount"
                    />
                    <InputGroup.Text style={{ backgroundColor: '#343a40', color: '#fff' }}>.00</InputGroup.Text>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: '#2b3035', borderColor: '#343a40' }}>
                <Button onClick={handleClose} variant="secondary">Close</Button>
                <Button onClick={handleBidSubmit} variant="warning">Submit Bid</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BidModal;
