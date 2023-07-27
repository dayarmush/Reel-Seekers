import { useLoadScript } from "@react-google-maps/api"
import SimpleMap from "./Map"
import '../style/Home.css'
import { useEffect, useState, useMemo, useRef } from "react"

function Home() {

  const [lakes, setLakes] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [ libraries ] = useState(['places']);

  useEffect(() => {
    fetch('/lakes')
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLakes(data)
          setIsLoading(false)
        })
      } else {
        r.json().
        then(err => {
          setError(err.error)
          setIsLoading(false)
        })
      }
    })
    .catch(err => {
      setError('Network Error.', 'Please try again later.')
      setIsLoading(false)
    })
  }, [])

  let key = process.env.REACT_APP_API_KEY

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: key,
    libraries
  });

  if (!isLoaded) return <h1>Loading Map...</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <div>
      <div className="map-container">
        <SimpleMap/>
      </div>
      <label>Search Lakes:
        <input 
          placeholder="Enter Lake"
          type="text"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </label>
    </div>
  )
  
}

export default Home;