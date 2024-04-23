import React, { useEffect, useState } from 'react';
import Listing from "../components/Listing";
import Pagination from 'react-bootstrap/Pagination';
import { Container } from 'react-bootstrap';
import { Box } from '@mui/material';
import { PuffLoader } from "react-spinners";
import { useFavorites } from '../context/FavoritesContext';

const Favs = () => {
    const { favorites } = useFavorites();
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const listingsPerPage = 4;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentFavorites = favorites.slice(indexOfFirstListing, indexOfLastListing);
    const totalPages = Math.ceil(favorites.length / listingsPerPage);

    useEffect(() => {
        if (favorites.length >= 0) {
            setIsLoading(false);
        }
    }, [favorites]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Container className="custom-container" style={{ minHeight: 400 }}>
                <h2 className="text-center my-4" style={{ fontFamily: "Poppins", fontWeight: 700 }}>My Favourites</h2>
                <Box component="hr" sx={{
                    border: 'none',
                    borderBottom: '2px ',
                    color: 'grey',
                    marginTop: '1px',
                    marginBottom: '1px',
                }} />
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '15px' }}>
                        <PuffLoader color='#F6AE2D' />
                    </div>
                ) : favorites.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <p style={{ fontFamily: "Poppins", fontSize: '18px', fontWeight: '600', color: '#1C2541' }}>No Properties Have Been Favorited.</p>
                    </div>
                ) : (
                    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {currentFavorites.map(listing => <Listing key={listing.id} listing={listing} />)}
                    </main>
                )}
                {totalPages > 1 && (
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
                )}
            </Container>
        </main>
    );
};

export default Favs;

