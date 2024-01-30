import { useEffect, useState } from "react";
import { getListings } from '../api/axios';
import SearchBar from '../components/SearchBar';
import ListPage from '../components/ListPage';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state

  useEffect(() => {
    setLoading(true); // Start loading
    getListings().then(json => {
      setListings(json);
      setSearchResults(json);
      setLoading(false); // Stop loading once the data is fetched
    });
  }, []);

  return (
    <div className="home">
      <SearchBar listings={listings} setSearchResults={setSearchResults} setLoading={setLoading} />
      <ListPage searchResults={searchResults} isLoading={loading} />
    </div>
  );
};

export default Home;
