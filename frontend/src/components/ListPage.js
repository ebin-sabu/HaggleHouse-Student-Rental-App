import Listing from "../components/Listing"

const ListPage = ({ searchResults }) => {

    const results = searchResults.map(listing => <Listing key={listing.id} listing={listing} />)

    const content = results?.length ? results : <article><p>No Matching Posts</p></article>

    return (

        <main>{content}</main>
    )
}
export default ListPage