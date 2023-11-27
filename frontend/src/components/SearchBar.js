
const SearchBar = ({ listings, setSearchResults }) => {
    const handleSubmit = (e) => e.preventDefault()

    const handleSearchChange = (e) => {
        if (!e.target.value) return setSearchResults(listings)

        const resultsArray = listings.filter(listings => listings.title.toLowerCase().includes(e.target.value.toLowerCase()) || listings.description.toLowerCase().includes(e.target.value.toLowerCase()) || listings.city.toLowerCase().includes(e.target.value.toLowerCase()) || listings.country.toLowerCase().includes(e.target.value.toLowerCase()))

        setSearchResults(resultsArray)
    }

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                className="search__input"
                type="text"
                id="search"
                onChange={handleSearchChange}
            />
            <button className="search__button">
                Search
            </button>
        </form>
    )
}
export default SearchBar