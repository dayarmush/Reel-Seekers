import { useLoadScript } from "@react-google-maps/api"
import SimpleMap from "./Map"
import '../style/Home.css'
import { useEffect, useState } from "react"
import LakeCard from './LakeCard'

function Home() {

  const [lakes, setLakes] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ libraries ] = useState(['places'])

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

  let searchFilter = lakes.filter(lake => lake.name.toLowerCase().includes(search.toLowerCase()))

  if (!isLoaded) return <h1>Loading Map...</h1>
  if (isLoading) return <h1>Loading...</h1>

  return (
    <div>
      <div className="map-container">
        <SimpleMap lakes={lakes}/>
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
        {!isLoading && searchFilter.map(lake => {
          return <LakeCard key={lake.id} lake={lake}/>
        })}
      </div>
      {error && <h2>{error}</h2>}
    </div>
  )
  
}

export default Home;



// import requests
// import os
// from dotenv import load_dotenv

// load_dotenv()

// def get_location(lake_name, api_key):
//     base_url = "https://maps.googleapis.com/maps/api/geocode/json"

//     params = {
//         "address": lake_name,
//         "key": api_key
//     }

//     response = requests.get(base_url, params=params)
//     res_json = response.json()
    
//     if res_json['status'] == 'OK':
//         return res_json['results'][0]['geometry']['location']

//     return None

// def get_state(location, api_key):
//     base_url = "https://maps.googleapis.com/maps/api/geocode/json"

//     params = {
//         "latlng": f"{location['lat']},{location['lng']}",
//         "key": api_key
//     }

//     response = requests.get(base_url, params=params)
//     res_json = response.json()

//     if res_json['status'] == 'OK':
//         for result in res_json['results']:
//             for component in result['address_components']:
//                 if 'administrative_area_level_1' in component['types']:
//                     return component['long_name']

//     return "State not found."

// api_key = os.getenv("MAP_API_KEY")

// lake_name = "Lake huron"
// location = get_location(lake_name, api_key)
// if location:
//     state = get_state(location, api_key)
//     print(f"{lake_name} is in {state}")
// else:
//     print(f"Location not found for {lake_name}")