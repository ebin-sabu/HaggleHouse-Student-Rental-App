import { useEffect, useState } from "react"
import { getListings } from '../api/axios'
import SearchBar from '../components/SearchBar'
import ListPage from '../components/ListPage'


const Home = () => {
  const [listings, setListings] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    getListings().then(json => {
      setListings(json)
      setSearchResults(json)
    })
  }, [])

  return (
    <>
      <div className="home">
        <SearchBar listings={listings} setSearchResults={setSearchResults} />
        <ListPage searchResults={searchResults} />
      </div>
    </>
  )
}

export default Home