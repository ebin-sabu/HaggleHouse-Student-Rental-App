import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const SearchBar = ({ listings, setSearchResults, setLoading }) => {
    const handleSubmit = (e) => e.preventDefault();

    const handleSearchChange = (e) => {
        setLoading(true); // Set loading to true when search starts

        if (!e.target.value) {
            setSearchResults(listings);
            setLoading(false); // Set loading to false when no input
            return;
        }

        const resultsArray = listings.filter(listings => listings.title.toLowerCase().includes(e.target.value.toLowerCase()) || listings.address.toLowerCase().includes(e.target.value.toLowerCase()) || listings.description.toLowerCase().includes(e.target.value.toLowerCase()) || listings.city.toLowerCase().includes(e.target.value.toLowerCase()) || listings.country.toLowerCase().includes(e.target.value.toLowerCase()))

        setSearchResults(resultsArray);
        setLoading(false); // Set loading to false when search is done
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <InputGroup size="lg">
                <Form.Control type="text" placeholder="Search..." onChange={handleSearchChange} />

            </InputGroup>
        </form>
    )
}
export default SearchBar