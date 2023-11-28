const Listing = ({ listing }) => {
    return (
        <div className="listing-details">
            <img id="myImg" alt="Cover" src={listing.image}></img>
            <h4>{listing.title}</h4>
            <p><strong>Location: </strong>{listing.address} , {listing.city}</p>
            <p>{listing.description}</p>
            <h5><strong>Price: £{listing.price}</strong></h5>
            <button>Save</button>
        </div>
    )
}
export default Listing