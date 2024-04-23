import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row, FloatingLabel, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getPropertyDetails, updateProperty } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const EditPropertyForm = () => {
    const { propertyId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        country: '',
        city: '',
        facilities: { bedrooms: '', bathrooms: '' },
        userId: '',
        images: [],
        imageDescriptions: [],
        imageCount: 0,
    });

    const handleBack = () => {
        navigate('/my-properties');
    };

    useEffect(() => {
        const fetchProperty = async () => {
            setIsLoading(true);
            try {
                const data = await getPropertyDetails(propertyId);
                setFormState(currentState => ({
                    ...currentState,
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    address: data.address,
                    country: data.country,
                    city: data.city,
                    facilities: data.facilities,
                }));
            } catch (error) {
                toast.error('Failed to fetch property details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperty();
    }, [propertyId]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "bedrooms" || name === "bathrooms") {
            setFormState({ ...formState, facilities: { ...formState.facilities, [name]: value } });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Prepare the data to be sent
        const propertyData = {
            ...formState
        };

        // Remove properties not needed for the PATCH request
        delete propertyData.images;
        delete propertyData.imageDescriptions;
        delete propertyData.imageCount;

        console.log(propertyData)

        try {
            // Call the updateProperty function
            await updateProperty(propertyId, propertyData);
            toast.success('Property updated successfully!');
            navigate('/my-properties');
        } catch (error) {
            toast.error(`Error updating property: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <IconButton onClick={() => navigate(-1)} aria-label="back">
                    <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
                </IconButton>
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="custom-container">
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Edit Your Listing</h2>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Form noValidate onSubmit={handleSubmit}>
                    {/* Title */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingTitle" label="Title">
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={formState.title}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    {/* Price */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingPrice" label="Price">
                                <Form.Control
                                    type="number"
                                    name="price"
                                    placeholder="Enter Price"
                                    value={formState.price}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    {/* Description */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingDescription" label="Description">
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    placeholder="Description"
                                    value={formState.description}
                                    onChange={handleChange}
                                    style={{ height: '100px' }}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    {/* Address */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="6">
                            <FloatingLabel controlId="floatingAddress" label="Address">
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formState.address}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    {/* Country and City */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="3">
                            <FloatingLabel controlId="floatingCountry" label="Country">
                                <Form.Control
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={formState.country}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group as={Col} md="3">
                            <FloatingLabel controlId="floatingCity" label="City">
                                <Form.Control
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    value={formState.city}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>
                    {/* Facilities */}
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="3">
                            <FloatingLabel label="Bedrooms">
                                <Form.Control
                                    as="select"
                                    name="bedrooms"
                                    value={formState.facilities.bedrooms}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: "facilities",
                                            value: { ...formState.facilities, bedrooms: parseInt(e.target.value, 10) }, // Ensure numerical value
                                        },
                                    })}
                                >
                                    <option value="">Select bedrooms</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </Form.Control>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group as={Col} md="3">
                            <FloatingLabel label="Bathrooms">
                                <Form.Control
                                    as="select"
                                    name="bathrooms"
                                    value={formState.facilities.bathrooms}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: "facilities",
                                            value: { ...formState.facilities, bathrooms: parseInt(e.target.value, 10) }, // Ensure numerical value
                                        },
                                    })}
                                >
                                    <option value="">Select bathrooms</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </Form.Control>
                            </FloatingLabel>
                        </Form.Group>
                    </Row>


                    {/* Submit Button */}
                    <div className="d-flex justify-content-center mt-3">
                        <Button variant="secondary" style={{ fontFamily: "Poppins", fontWeight: 500, margin: 5 }} onClick={handleBack}>Cancel</Button>
                        <Button variant="warning" style={{ fontFamily: "Poppins", fontWeight: 500, margin: 5 }} type="submit">
                            Update Property
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    );
};

export default EditPropertyForm;
