import React, { useEffect, useState } from 'react';
import { Container, } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getPropertiesByLandlord } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Box } from '@mui/material';
import Pagination from 'react-bootstrap/Pagination';
import { PuffLoader } from "react-spinners";
import Listing from "../components/Listing";
import { AddCircleOutline as AddIcon } from '@mui/icons-material'; // Import AddIcon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const MyProperties = () => {
    const [properties, setProperties] = useState([]);
    const { currentUser } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 1;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const MyProperties = properties.slice(indexOfFirstListing, indexOfLastListing);
    const navigate = useNavigate();

    const totalPages = Math.ceil(properties.length / listingsPerPage);


    useEffect(() => {
        const fetchProperties = async () => {
            if (currentUser) {
                try {
                    const data = await getPropertiesByLandlord(currentUser.id);
                    setProperties(data);
                } catch (error) {
                    toast.error('Failed to fetch properties');
                }
            }
        };

        fetchProperties();
    }, [currentUser]);

    return (
        <Container className="custom-container" style={{ minHeight: '400px', position: 'relative' }}>
            <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>My Properties</h2>
            <Box component="hr" sx={{
                border: 'none',
                borderBottom: '2px dotted',
                color: 'grey',
                marginTop: '1px',
                marginBottom: '1px',
            }} />
            <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {MyProperties.length > 0 ? (
                    MyProperties.map((property) => <Listing key={property.id} listing={property} />)
                ) : (
                    // Display the box with the plus icon and text when there are no properties
                    <Box
                        sx={{
                            margin: '20px',
                            border: '2px dotted',
                            color: 'grey',
                            borderRadius: '20px',
                            padding: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '200px',
                            cursor: 'pointer',
                            flexDirection: 'column' // Ensure the flex direction is column to stack icon and text vertically
                        }}
                        onClick={() => navigate('/create-property')}
                    >
                        {/* Flexbox container for centering the icon and text */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AddIcon fontSize="large" />
                            <span style={{
                                fontFamily: "Poppins",
                                fontWeight: 400,
                                fontSize: '0.8rem',
                                color: "black",
                                marginTop: '10px' // Add some space between the icon and text
                            }}>Add a Listing</span>
                        </div>
                    </Box>
                )}
            </main>

            {
                totalPages > 1 && (
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.First onClick={() => setCurrentPage(1)} />
                        <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} />
                        {[...Array(totalPages).keys()].map(number => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                    </Pagination>
                )
            }

        </Container >
    );
};

export default MyProperties;

