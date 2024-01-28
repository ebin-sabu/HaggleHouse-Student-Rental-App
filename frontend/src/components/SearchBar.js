import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


const SearchBar = ({ listings, setSearchResults }) => {
    const handleSubmit = (e) => e.preventDefault()

    const handleSearchChange = (e) => {
        if (!e.target.value) return setSearchResults(listings)

        const resultsArray = listings.filter(listings => listings.title.toLowerCase().includes(e.target.value.toLowerCase()) || listings.address.toLowerCase().includes(e.target.value.toLowerCase()) || listings.description.toLowerCase().includes(e.target.value.toLowerCase()) || listings.city.toLowerCase().includes(e.target.value.toLowerCase()) || listings.country.toLowerCase().includes(e.target.value.toLowerCase()))

        setSearchResults(resultsArray)
    }

    return (
        <form className="search" onSubmit={handleSubmit}>
            <InputGroup size="lg">
                <Form.Control type="text" placeholder="Search..." onChange={handleSearchChange} />

            </InputGroup>
        </form>
    )
}
export default SearchBar