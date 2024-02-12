import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import { useFavorites } from '../context/FavoritesContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function Popup({ show, onHide, title, image, price, address, city, country, propertyId }) {
    const { favorites, handleToggleFavorite } = useFavorites();
    const isFavorited = favorites.some(fav => fav.id === propertyId);

    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing" src={image}></img>
                            <Carousel.Caption>
                                <p>Image1: Living Room</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing" src={image}></img>
                            <Carousel.Caption>
                                <p>Image2: Bedroom</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing" src={image}></img>
                            <Carousel.Caption>
                                <p>Image3: Bathroom</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                        <button
                            onClick={() => handleToggleFavorite(propertyId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {isFavorited ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
                        </button>
                    </div>
                    <br />

                    <p><strong>£: {price}</strong></p>
                    <p><strong>Location: </strong>{address}, {city}, {country}<br /></p>
                    {/* Detailed Description */}
                    <div className="d-grid gap-2">
                        <Button variant="warning">Make a Bid</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Popup;
