import { useEffect, useState } from "react"

// components
import ListingDetails from "../components/ListingDetails"

const Home = () => {
  const [residencies, setResidencies] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch('http://localhost:8000/api/residency/allresd')
      const json = await response.json()

      if (response.ok) {
        setResidencies(json)
      }
    }

    fetchListings()
  }, [])

  return (
    <div className="home">
      <div className="listings">
        {residencies && residencies.map((residency, index) => (
          <ListingDetails key={residency._id || index} residency={residency} />
        ))}
      </div>
    </div>
  )
}

export default Home