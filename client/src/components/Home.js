import '../style/Home.css'
import SimpleMap from "./Map"
import { useState } from "react"
import LakeCard from './LakeCard'

function Home({ isLoaded, lakes, error }) {

  const [search, setSearch] = useState('')

  let searchFilter = lakes.filter(lake => lake.name.toLowerCase().includes(search.toLowerCase()))

  if (!isLoaded) return <h1>Loading Map...</h1>

  return (
    <div>
      <div className="map-container">
        <SimpleMap lakes={searchFilter}/>
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
      <div>
        {
        searchFilter.filter(lake => lake.status === 'approved').map(lake => {
          return <LakeCard key={lake.id} lake={lake} />
        })}
      </div>
      {error && <h2>{error}</h2>}
    </div>
  )
  
}

export default Home;