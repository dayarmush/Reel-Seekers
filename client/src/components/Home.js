import '../style/Home.css'
import SimpleMap from "./Map"
import { useState } from "react"
import LakeCard from './LakeCard'
import PlacesAutocomplete from './PlacesAutocomplete'

function Home({ isLoaded, lakes, error, searchCenter, setSearchCenter }) {

  const [search, setSearch] = useState('')

  let searchFilter = lakes.filter(lake => lake.name.toLowerCase().includes(search.toLowerCase()))

  if (!isLoaded) return <h1>Loading Map...</h1>

  return (
    <div className='home-container'>
      <PlacesAutocomplete setSearchCenter={setSearchCenter}/>
      <SimpleMap lakes={searchFilter} searchCenter={searchCenter} />

      <div className='input-container'>
        <input 
          placeholder="🔎  Search Lakes"
          type="text"
          name="search"
          value={search}
          className='search-input'
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className='card-container'>
        {searchFilter.filter(lake => lake.status === 'approved').map(lake => {
          return <LakeCard key={lake.id} lake={lake} />
        })}
      </div>
      
      {error && <h2>{error}</h2>}
    </div>
  )
  
}

export default Home;