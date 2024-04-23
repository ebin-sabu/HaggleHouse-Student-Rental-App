import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, FloatingLabel } from 'react-bootstrap';
import { createProperty } from '../api/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { PuffLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';



const CreatePropertyForm = () => {
    const initialState = {
        title: '',
        description: '',
        price: '',
        address: '',
        country: '',
        city: '',
        facilities: { bedrooms: '', bathrooms: '' },
        images: [],
        imageDescriptions: [],
        imageCount: 0,
        deadline: new Date(),
        availableRooms: ''
    };

    const [formState, setFormState] = useState(initialState);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const addImageField = () => {
        if (formState.imageCount < 5) {
            setFormState(prevState => ({
                ...prevState,
                imageCount: prevState.imageCount + 1,
                images: [...prevState.images, ''], // Add a placeholder for the new image
                imageDescriptions: [...prevState.imageDescriptions, ''], // Add a placeholder for the new description
            }));
        } else {
            toast.error('You can only add up to 5 images.');
        }
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name.startsWith("imageDescription-")) {
            const index = parseInt(name.split("-")[1], 10);
            const newDescriptions = [...formState.imageDescriptions];
            newDescriptions[index] = value; // Update the specific description at the index
            setFormState({ ...formState, imageDescriptions: newDescriptions });
        }
        else if (name === "deadline") {
            // Special handling for deadline field
            setFormState({ ...formState, [name]: value });
        } else if (name === "images") {
            setFormState({ ...formState, images: files, imageDescriptions: Array(files.length).fill('') });
        } else if (name === "bedrooms" || name === "bathrooms") {
            const updatedFacilities = { ...formState.facilities, [name]: value };
            setFormState({ ...formState, facilities: updatedFacilities });
            if (name === "bedrooms") {
                setFormState(prevState => ({ ...prevState, availableRooms: value }));
            }
        } else if (name === "description") {
            const words = value.split(/\s+/);
            if (words.length <= 100) {
                setFormState({ ...formState, [name]: value });
            } else {
                alert("Description cannot exceed 100 words.");
            }
        } else {
            setFormState({ ...formState, [name]: value });
        }
    };

    const handleDateChange = (date) => {
        setFormState({ ...formState, deadline: date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.id) {
            toast.error('User must be logged in to create a property.');
            return;
        }
        setIsLoading(true);

        const formData = new FormData();
        formState.images.forEach((file, index) => formData.append("images", file)); // Append each image file
        formState.imageDescriptions.forEach((desc, index) => {
            formData.append(`imageDescription-${index}`, desc); // Append each image description with a unique key
        });

        // Append other form fields as necessary
        Object.entries(formState).forEach(([key, value]) => {
            if (key !== "images" && key !== "imageDescriptions") {
                if (key === "facilities") {
                    formData.append(key, JSON.stringify(value));
                } else if (key === "availableRooms") {
                    formData.append(key, parseInt(value, 10));
                }
                else {
                    formData.append(key, value);
                }
            }
        });

        formData.append('userId', currentUser.id); // Append userId to formData

        // Ensure deadline is appended as a single ISO string
        if (formState.deadline instanceof Date && !isNaN(formState.deadline.getTime())) {
            formData.set('deadline', formState.deadline.toISOString()); // Use set to ensure a single value
        } else {
            toast.error('Invalid deadline date provided.');
            setIsLoading(false);
            return; // Stop the form submission
        }

        try {
            await createProperty(formData);
            toast.success('Property created successfully!');
            setFormState(initialState); // Reset form after successful submission
            navigate('/');
        } catch (error) {
            toast.error(`Error creating property: ${error.message}`);
            setIsLoading(false);
        }
    };


    const handleFileChange = (e, index) => {
        const newImages = [...formState.images];
        newImages[index] = e.target.files[0]; // Update the specific image at the index
        setFormState({ ...formState, images: newImages });
    };

    return (
        <Container className="custom-container">
            <IconButton onClick={() => navigate(-1)} aria-label="back">
                <KeyboardBackspaceIcon style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: '2rem', color: '#1C2541' }} />
            </IconButton>
            {isLoading ? (
                <div className="spinner-container">
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '15px' }}>
                        <PuffLoader color='#F6AE2D' />
                    </div>
                </div>
            ) : (
                <Form noValidate onSubmit={handleSubmit}>
                    <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>Make a Listing</h2>
                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="6" controlId="title" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
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

                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="3" controlId="price" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                            Price:
                            <FloatingLabel controlId="floatingPrice">
                                <Form.Control
                                    type="number"
                                    name="price"
                                    placeholder="Enter Secret Price"
                                    value={formState.price}
                                    onChange={handleChange}
                                />
                            </FloatingLabel>
                        </Form.Group>
                        {/* Deadline */}
                        <Form.Group as={Col} md="3" controlId="deadline" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                            Deadline:
                            <FloatingLabel controlId="floatingDeadline">
                                <DatePicker
                                    selected={formState.deadline}
                                    onChange={handleDateChange}
                                    className="form-control custom-datepicker"
                                    dateFormat="MMMM d, yyyy"
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>


                    <Row className="mb-3 justify-content-md-center">
                        {/* Description */}
                        <Form.Group as={Col} md="6" controlId="description" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                            <FloatingLabel controlId="floatingDescription" label="Description">
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    placeholder="Description"
                                    value={formState.description}
                                    onChange={handleChange}
                                    style={{ height: '100px' }} // Adjust height as needed
                                />
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3 justify-content-md-center">
                        <Form.Group as={Col} md="3" controlId="bedrooms">
                            <FloatingLabel controlId="floatingDescription">
                                <Form.Control style={{ fontFamily: 'Poppins', fontWeight: 500, margin: 2 }} as="select" name="bedrooms" value={formState.facilities.bedrooms} onChange={handleChange}>
                                    <option value="">Select bedrooms</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num}</option>)}
                                </Form.Control>
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group as={Col} md="3" controlId="bathrooms">
                            <FloatingLabel controlId="floatingDescription">
                                <Form.Control style={{ fontFamily: 'Poppins', fontWeight: 500, margin: 2 }} as="select" name="bathrooms" value={formState.facilities.bathrooms} onChange={handleChange}>
                                    <option value="">Select bathrooms</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num}</option>)}
                                </Form.Control>
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3 justify-content-md-center">
                        {/* Address */}
                        <Form.Group as={Col} md="6" controlId="address" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
                            <FloatingLabel controlId="floatingDescription" label="Address">
                                <Form.Control
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formState.address}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">err</Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3 justify-content-md-center">
                        {/* Country */}
                        <Form.Group as={Col} md="3" controlId="country" style={{ fontFamily: 'Poppins', fontWeight: 500, margin: 2 }}>
                            <FloatingLabel controlId="floatingDescription" label="Country">
                                <Form.Control
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    value={formState.country}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">err</Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>

                        {/*City */}
                        <Form.Group as={Col} md="3" controlId="city" style={{ fontFamily: 'Poppins', fontWeight: 500, margin: 2 }}>
                            <FloatingLabel controlId="floatingDescription" label="City">
                                <Form.Control
                                    type="text"
                                    name="city"
                                    placeholder='City'
                                    value={formState.city}
                                    onChange={handleChange}
                                />
                                <Form.Control.Feedback type="invalid">err</Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                    </Row>

                    {Array.from({ length: formState.imageCount }).map((_, index) => (
                        <Row key={index} className="mb-3 justify-content-md-center">
                            <Form.Group as={Col} md="6">
                                <FloatingLabel label={`Image Number ${index + 1}:`}>
                                    <Form.Control
                                        type="file"
                                        name={`image-${index}`}
                                        onChange={(e) => handleFileChange(e, index)}
                                        placeholder="Image"
                                    />
                                </FloatingLabel>
                                <FloatingLabel label={`Image Description:`}>
                                    <Form.Control
                                        type="text"
                                        name={`imageDescription-${index}`}
                                        placeholder="Enter description"
                                        value={formState.imageDescriptions[index] || ''}
                                        onChange={handleChange}
                                        className="mt-3" // Margin top for spacing
                                    />
                                </FloatingLabel>
                            </Form.Group>
                        </Row>
                    ))}

                    <div className="d-flex justify-content-center mt-3">
                        <Button variant='dark' style={{ bgcolor: '#2b3035', color: 'white', '&:hover': { bgcolor: '#f8f9fa', color: 'black' }, fontFamily: "Poppins", fontWeight: 500 }} onClick={addImageField} className="me-2" disabled={formState.imageCount >= 5}>
                            Add Image
                        </Button>
                        <Button variant='warning' style={{ fontFamily: "Poppins", fontWeight: 500 }} type="submit">
                            {isLoading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    {' Loading...'}
                                </>
                            ) : 'Create Property'}
                        </Button>
                    </div>

                </Form>
            )}
        </Container>
    );
};

export default CreatePropertyForm;