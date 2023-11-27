const ListingDetails = ({ residency }) => {

    return (
        <div className="listing-details">
            <h4>{residency.title}</h4>
            <p><strong>Location: </strong>{residency.address} , {residency.city}</p>
            <p>{residency.description}</p>
            <p><strong>Price: £{residency.price}</strong></p>
            <p>{residency.createdAt}</p>
            <img id="myImg" alt="Cover" src={residency.image}></img>
        </div>
    )
}

export default ListingDetails