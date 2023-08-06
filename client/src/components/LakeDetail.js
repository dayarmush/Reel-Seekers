import Fish from "./Fish"
import Reviews from "./Reviews"
import Messages from './Messages'
import AddFavorite from "./AddFavorite"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import DirectionsHandler from "./Directions"
import PlacesAutocomplete from "./PlacesAutocomplete"
import { GoogleMap, MarkerF } from '@react-google-maps/api'

function LakeDetail({ user, isLoaded, setUser, lake, setLake, searchCenter, setSearchCenter }) {

  const { id } = useParams()
  const [error, setError] = useState('')
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    fetch(`/lakes/${id}`)
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => setLake(data))
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => setError('Network Error. Please try again later.'))
  }, [id, setLake])

  let total = 0;

  if (lake.reviews) {
    lake.reviews.map(rev => {
      total += rev.rating
      return total
    })
  }
  
  return (
    <div>
      {error && <h1>{error}</h1>}
      <h2>{lake.name}</h2>
      <h3>{lake.city}</h3>
      <h4>{lake.state}</h4>
      {lake.reviews && <h4>{total ? (total / lake.reviews.length).toFixed(1) : 0}</h4>}
      {lake.address && <h3>{lake.address}</h3>}
      <AddFavorite lakeId={lake.id} user={user} setUser={setUser}/>
      {isLoaded && !searchCenter.lat && <PlacesAutocomplete setSearchCenter={setSearchCenter}/>}
      {isLoaded && 
        lake.lat &&
        <GoogleMap
          zoom={15}
          center={{lat: lake.lat, lng: lake.lng}} 
          mapContainerClassName="map">
          <MarkerF position={{lat: lake.lat, lng: lake.lng}} />
          {searchCenter.lat &&
           <DirectionsHandler
            center={searchCenter}
            selectedMarker={lake}
            setDistance={setDistance}
            setDuration={setDuration}
          />
          }
        </GoogleMap>
      }

      {distance && <p>Distance: {distance}</p>}
      {duration && <p>Approximate Trip Length: {duration}</p>}
      
      {lake.messages && 
        <Messages 
          setLake={setLake} 
          messages={lake.messages} 
          user={user} 
          lakeId={lake.id}
        />
      }

      {lake.reviews && 
        <Reviews
          user={user}
          lakeId={lake.id}
          setLake={setLake}
          reviews={lake.reviews}
        />
      }
      
      {lake.lake_fish && 
        <Fish
          user={user}
          lakeId={lake.id}
          setLake={setLake}
          fishes={lake.lake_fish}
        />
      }
    </div>
  )
}

export default LakeDetail