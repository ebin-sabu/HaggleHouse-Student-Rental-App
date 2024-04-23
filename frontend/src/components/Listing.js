import React, { useState } from 'react';
import Popup from "../components/Popup";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Listing = ({ listing }) => {
    const [showPopup, setShowPopup] = useState(false);
    const togglePopup = () => setShowPopup(!showPopup);

    // Get the first image URL or a placeholder if no images are available
    const imageUrl = listing.images.length > 0 ? listing.images[0].url : 'placeholder-image-url';

    // Function to truncate the description
    const truncateDescription = (description, maxLength) => {
        return description.length > maxLength ? description.substring(0, maxLength) + "..." : description;
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '470px', margin: '15px', fontFamily: "Poppins" }}>
            <Card className="bg-light text-dark" style={{ width: '18rem', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card.Img variant="top" src={imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                <Card.Body className="text-center" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, paddingBottom: '20px' }}>
                    <Card.Header style={{ marginBottom: '10px' }}>
                        <Card.Title style={{ fontSize: '1rem', color: '#1C2541', fontWeight: 600 }}>{listing.title}</Card.Title>
                    </Card.Header>
                    <div style={{ flexGrow: 1, overflow: 'auto' }}>
                        <p><span style={{ fontSize: '1rem', color: '#1C2541', fontWeight: 600 }} >Location: </span>{listing.address}, {listing.city}.</p>
                        <p style={{ fontSize: '0.8rem', color: '#6c757d' }}>{truncateDescription(listing.description, 55)}</p>
                    </div>
                    <div className="d-grid gap-2" style={{ marginTop: '0px' }}>
                        <Button variant="dark" size="sm" style={{ fontFamily: "Poppins", fontWeight: 500 }} onClick={togglePopup}>View Details</Button>
                    </div>
                </Card.Body>
            </Card>
            {showPopup &&
                <Popup
                    show={showPopup}
                    onHide={togglePopup}
                    title={listing.title}
                    images={listing.images} // Pass the entire array of images
                    address={listing.address}
                    city={listing.city}
                    country={listing.country}
                    propertyId={listing.id}
                    description={listing.description}
                    facilities={listing.facilities}
                    landlord={listing.userId}
                    deadline={listing.deadline}
                    live={listing.live}
                    available={listing.availableRooms}
                />
            }
        </div>
    );
}

export default Listing;
