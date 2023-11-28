import Popup from "../components/Popup"

const Listing = ({ listing }) => {
    return (
        <div className="listing-details">
            <img id="myImg" alt="Cover" src={listing.image}></img>
            <h4>{listing.title}</h4>
            <p><strong>Location: </strong>{listing.address} , {listing.city}</p>
            <p>{listing.description}</p>
            <h5><strong>Price: £{listing.price}</strong></h5>
            <Popup title={listing.title} image={listing.image} price={listing.price} address={listing.address} city={listing.city} country={listing.country} />
        </div>
    )
}
export default Listing