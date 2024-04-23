import React, { useEffect, useState } from "react";
import { getListings } from "../api/axios";
import SearchBar from "../components/SearchBar";
import ListPage from "../components/ListPage";
import { Modal, Button } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    if (currentUser && currentUser.landlord) {
      navigate("/my-properties");
    }

    setLoading(true);
    getListings().then((json) => {
      setListings(json);
      setSearchResults(json);
      setLoading(false);
    });

    const visitTimestamp = localStorage.getItem("visitTimestamp");
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000;

    // Check if more than an hour has passed since last visit
    if (!visitTimestamp || currentTime - visitTimestamp > oneHour) {
      if (!currentUser) {
        setShowModal(true);
        // Update the timestamp in localStorage
      }
      localStorage.setItem("visitTimestamp", currentTime.toString());
    }
  }, []);

  // Styles for dark mode
  const darkModalStyle = {
    backgroundColor: "#faf9f5",
    color: "#2b3035",
  };

  return (
    <div className="home" style={{ backgroundColor: '#f8f9fa', minHeight: 400 }}>
      <SearchBar listings={listings} setSearchResults={setSearchResults} setLoading={setLoading} />
      <Box component="hr" sx={{
        border: 'none',
        borderBottom: '2px dotted',
        color: 'grey',
        marginTop: '10px',
        marginBottom: '1px',
      }} />
      <ListPage searchResults={searchResults} isLoading={loading} />

      {/* Modal for visitors with dark mode styling */}
      <Modal style={{ fontFamily: "Poppins" }} show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={darkModalStyle}>
          <Modal.Title>Welcome to < span className="highlight">HaggleHouse</span></Modal.Title>
        </Modal.Header>
        <Modal.Body style={darkModalStyle}>
          <p>This is your go-to platform for finding or listing properties. Whether you're looking to rent a room, find a flatmate, or list your property, we've got you covered.</p>
          <p>Sign-up Now to get started with the haggle ...</p>
        </Modal.Body>
        <Modal.Footer style={darkModalStyle}>
          <Button variant='dark' style={{ bgcolor: '#2b3035', color: 'white', '&:hover': { bgcolor: '#f8f9fa', color: 'black' }, fontFamily: "Poppins", fontWeight: 500 }} onClick={() => setShowModal(false)} as={Link} to="/login">
            Login
          </Button>
          <Button variant='warning' style={{ fontFamily: "Poppins", fontWeight: 500 }} onClick={() => setShowModal(false)} as={Link} to="/sign-up">
            Sign-up
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;


