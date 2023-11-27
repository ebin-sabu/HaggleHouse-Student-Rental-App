const Listing = ({ listing }) => {
    return (
        <div className="listing-details">
            <h4>{listing.title}</h4>
            <p><strong>Location: </strong>{listing.address} , {listing.city}</p>
            <p>{listing.description}</p>
            <p><strong>Price: £{listing.price}</strong></p>
            <p>{listing.createdAt}</p>
            <img id="myImg" alt="Cover" src={listing.image}></img>
            <button>Save</button>
        </div>
    )
}
export default Listing