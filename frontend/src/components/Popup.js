import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function Popup(popuplisting) {
    const [show, setShow] = useState(false);

    return (
        <>
            <div className="position-absolute top-100 start-50 translate-middle">
                <div className="d-grid gap-2">
                    <Button variant="dark" size="sm" onClick={() => setShow(true)}>View</Button>{' '}
                </div>
            </div>

            <Modal
                show={show}
                onHide={() => setShow(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        {popuplisting.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Carousel>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing-Image" src={popuplisting.image}></img>
                            <Carousel.Caption>
                                <p>Image1: Living Room</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing-Image" src={popuplisting.image}></img>
                            <Carousel.Caption>
                                <p>Image2: Kitchen</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className='popup-Image' alt="Listing-Image" src={popuplisting.image}></img>
                            <Carousel.Caption>
                                <p>Image3: Bedroom</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                    <br />
                    <p><strong>£: {popuplisting.price}</strong></p>
                    <p><strong>Location: </strong>{popuplisting.address}, {popuplisting.city}, {popuplisting.country}<br /></p>
                    <p>
                        <strong>Detailed Description of Listing:</strong><br /> Ipsum molestiae
                        natus adipisci modi eligendi? Debitis amet quae undecommodi
                        aspernatur enim, consectetur. Cumque deleniti temporibus
                        ipsam atque a dolores quisquam quisquam adipisci possimus
                        laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
                        accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
                        reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
                        deleniti rem!
                    </p>
                    <div className="d-grid gap-2">
                        <Button variant="warning">Make a Bid</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Popup;