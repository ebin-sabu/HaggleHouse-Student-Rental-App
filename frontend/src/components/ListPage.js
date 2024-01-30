import Listing from "../components/Listing";
import { PuffLoader } from "react-spinners";

const ListPage = ({ searchResults, isLoading }) => {
    const results = searchResults.map(listing => <Listing key={listing.id} listing={listing} />);

    let content;
    if (isLoading) {
        content = (
            <div className="wrapper flexCenter" style={{ height: "60vh" }}>
                <PuffLoader
                    height="80"
                    width="80"
                    radius={1}
                    color="#4066ff"
                    aria-label="puff-loading"
                />
            </div>
        );
    } else {
        content = results.length > 0 ? results : <article><p>No Matching Posts</p></article>;
    }

    return (
        <main>{content}</main>
    );
}

export default ListPage;
