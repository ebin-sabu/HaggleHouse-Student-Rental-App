import React, { useState } from 'react';
import Popup from "../components/Popup";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Listing = ({ listing }) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => setShowPopup(!showPopup);

    return (
        // Wrap Card in a container div with Flexbox styling to center it
        <div style={{ display: 'flex', justifyContent: 'center', height: '515px', margin: '15px' }}> {/* Adjust height as needed */}
            <>
                <Card className="bg-light text-dark" style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={listing.image} style={{ height: '200px', objectFit: 'cover' }} />
                    <Card.Body className="text-center">
                        <Card.Header>
                            <Card.Title className="text-muted">{listing.title}</Card.Title>
                        </Card.Header>
                        <div>
                            <p><strong>Location: </strong>{listing.address}, {listing.city}.</p>
                            <p>{listing.description}</p>
                            <h5><strong>Price: £{listing.price}</strong></h5>
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="dark" size="sm" onClick={togglePopup}>View Details</Button>
                        </div>
                    </Card.Body>
                </Card>
                {showPopup &&
                    <Popup
                        show={showPopup}
                        onHide={togglePopup}
                        title={listing.title}
                        image={listing.image}
                        price={listing.price}
                        address={listing.address}
                        city={listing.city}
                        country={listing.country}
                        propertyId={listing.id}
                    />
                }
            </>
        </div>
    );
}

export default Listing;



