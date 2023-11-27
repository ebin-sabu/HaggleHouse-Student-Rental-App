
const ListingPopup = ({ title, address }) => {
    return (
        <div className="popup" id="popup">
            <h4>{title}</h4>
            <p>{address}</p>
            <p>my popup</p>
        </div>
    )
}

export default ListingPopup