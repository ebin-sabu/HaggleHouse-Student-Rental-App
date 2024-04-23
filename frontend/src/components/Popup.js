import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { useFavorites } from '../context/FavoritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import BidModal from './BidModel';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function Popup({ show, onHide, title, images, price, address, city, country, propertyId, description, facilities, landlord, bid, deadline, live, available }) {
    const { favorites, handleToggleFavorite } = useFavorites();
    const isFavorited = favorites.some(fav => fav.id === propertyId);
    const [showBidModal, setShowBidModal] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    deadline = format(new Date(deadline), 'PPp')

    const isCurrentUserLandlordOwner = currentUser && currentUser.id === landlord;
    const shouldDisableBidButton = currentUser ? (currentUser.landlord && currentUser.id !== landlord) || (bid && (bid.status === 'PENDING' || bid.status === 'ACCEPTED') || (!live)) : true;

    // Function to determine button text based on bid status
    const getBidButtonText = () => {
        // console.log(live);
        if (bid && bid.status === 'ACCEPTED') {
            return 'Bid has been Accepted';
        }
        //else if (!live) {
        //return 'Property Not Available';
        // }
        else if (bid && bid.status === 'PENDING') {
            return 'Bid is Pending';
        }
        else {
            return 'Make a Bid';
        }
    };

    // Function to render bid status message with appropriate color
    const renderBidStatusMessage = () => {
        if (bid && bid.status) {
            let message = '';
            let color = '';
            switch (bid.status) {
                case 'ACCEPTED':
                    message = 'Congratulations! Your Bid has been Accepted, and the Landlord will be in touch soon.';
                    color = '#2f7c31';
                    break;
                case 'REJECTED':
                    message = 'Unfortunately, your Bid has been Rejected.';
                    color = '#d32f2f';
                    break;
                case 'PENDING':
                    message = 'Bid status is Pending...';
                    color = '#1C2541';
                    break;
                default:
                    return null; // No message if there's no match or bid status is unknown
            }
            return <p style={{ color: color, fontFamily: "Poppins", marginTop: '10px' }}>{message}</p>;
        }
        return null;
    };



    const closeBidModal = () => {
        setShowBidModal(false);
    };

    // Assuming 'facilities' is a JSON object, let's display its properties in a list
    const renderFacilities = (facilities) => {
        // If facilities is not defined or empty, return null or a default message
        if (!facilities || Object.keys(facilities).length === 0) {
            return <p style={{ fontSize: '0.8rem', color: '#6c757d', fontFamily: "Poppins" }}>No facilities available.</p>;
        }

        return (
            <div>
                <p style={{ fontFamily: "Poppins" }} ><strong>Facilities:</strong></p>
                <ul style={{ fontSize: '0.8rem', color: '#6c757d', fontFamily: "Poppins" }}>
                    {Object.entries(facilities).map(([key, value], index) => (
                        <li key={index}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}: {value.toString()}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <Modal show={show} onHide={onHide} dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontFamily: "Poppins" }}>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        {images && images.map((img, index) => (
                            <Carousel.Item key={img.id || index}>
                                <img style={{ height: '350px', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='popup-Image' alt={`Slide ${index}`} src={img.url}></img>
                                <Carousel.Caption>
                                    <p style={{ fontFamily: "Poppins" }} >{img.description || `Image ${index + 1}`}</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>

                    {isCurrentUserLandlordOwner && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}> {/* Positioning the EditIcon */}
                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                onClick={() => navigate(`/edit-property/${propertyId}`)}>
                                <EditIcon color="action" style={{ fontSize: 30, color: '#0c6dfd' }} />
                            </button>
                        </div>
                    )}
                    {!isCurrentUserLandlordOwner && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>

                            <button
                                onClick={() => handleToggleFavorite(propertyId)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isFavorited ? <FavoriteIcon color='error' style={{ fontSize: 30 }} /> : <FavoriteBorderIcon color='error' style={{ fontSize: 30 }} />}
                            </button>
                        </div>
                    )}
                    <br />
                    {price && (
                        <div>
                            <h5 style={{ fontFamily: "Poppins" }} ><strong> Your Bid: £{price}</strong></h5>
                            {renderBidStatusMessage()}
                        </div>
                    )}
                    <p style={{ fontFamily: "Poppins", color: '#6c757d' }} ><strong>Rooms Remaning: <span style={{ color: "#d32f2f" }}> {available}</span> </strong><br /></p>
                    <p style={{ fontFamily: "Poppins" }} ><strong>Location: </strong>{address}, {city}, {country}<br /></p>
                    <p style={{ fontSize: '0.8rem', color: '#6c757d', fontFamily: "Poppins" }}>Deadline: <span style={{ color: '#d32f2f', fontWeight: 500 }}>{deadline}</span></p>
                    <p style={{ fontSize: '0.8rem', color: '#6c757d', fontFamily: "Poppins" }}>{description}</p>
                    {renderFacilities(facilities)}
                    <div className="d-grid gap-2">
                        {isCurrentUserLandlordOwner ? (
                            <>
                                <Button variant="warning" style={{ fontFamily: "Poppins", fontWeight: 500, color: "#1C2541" }} onClick={() => navigate(`/viewbids/${propertyId}`)}>View All Bids</Button>
                            </>
                        ) : (
                            <Button variant="warning" style={{ fontFamily: "Poppins", fontWeight: 500, color: "#1C2541" }} onClick={() => setShowBidModal(true)} disabled={shouldDisableBidButton}>
                                {getBidButtonText()}
                            </Button>
                        )}
                    </div>

                </Modal.Body>
            </Modal>

            <BidModal
                open={showBidModal}
                handleClose={closeBidModal}
                propertyId={propertyId}
            />
        </>
    );
}

export default Popup;
