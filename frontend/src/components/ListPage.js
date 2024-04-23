import React, { useState } from 'react';
import Listing from "./Listing";
import Pagination from 'react-bootstrap/Pagination';
import { PuffLoader } from "react-spinners";

const ListPage = ({ searchResults, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 4;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = searchResults.slice(indexOfFirstListing, indexOfLastListing);

    const totalPages = Math.ceil(searchResults.length / listingsPerPage);

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '15px' }}>
                    <PuffLoader color='#F6AE2D' />
                </div>
            ) : (
                <main>
                    {currentListings.map(listing => <Listing key={listing.id} listing={listing} />)}
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

export default ListPage;
