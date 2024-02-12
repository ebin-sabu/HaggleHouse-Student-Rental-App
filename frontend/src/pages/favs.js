import React, { useEffect, useState } from 'react';
import Listing from "../components/Listing"; // Ensure this path is correct
import Pagination from 'react-bootstrap/Pagination';
import { PuffLoader } from "react-spinners";
import { useFavorites } from '../context/FavoritesContext'; // Ensure this path is correct

const Favs = () => {
    const { favorites } = useFavorites();
    const [currentPage, setCurrentPage] = useState(1);
    // Adjust isLoading to be initially true if you expect data to be loaded initially
    const [isLoading, setIsLoading] = useState(true);

    const listingsPerPage = 12;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentFavorites = favorites.slice(indexOfFirstListing, indexOfLastListing);
    const totalPages = Math.ceil(favorites.length / listingsPerPage);

    useEffect(() => {
        // Simulate a loading effect, or set a condition for actual loading state
        if (favorites.length >= 0) {
            setIsLoading(false); // Set loading to false once favorites are checked
        }
    }, [favorites]);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '15px' }}>
                    <PuffLoader color='#F6AE2D' />
                </div>
            ) : favorites.length === 0 ? (
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1C2541' }}>No Properties Have Been Favorited.</p>
                </div>
            ) : (
                <main>
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
        </main>
    );
};

export default Favs;

