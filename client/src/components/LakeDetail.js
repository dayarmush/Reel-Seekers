import Fish from "./Fish"
import '../style/LakeDetail.css'
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

  return (
    <div className="lake-details">
      {error && <h1>{error}</h1>}
      <h2>{lake.name}</h2>
      {lake.address1 && <h3>{lake.address1}</h3>}
      <h3>{lake.city}</h3>
      <h4>{lake.state}</h4>

      <div className="favorite-container">
        <AddFavorite lakeId={lake.id} user={user} setUser={setUser}/>
      </div>

      <div className="details-container">
        <div className="search-container">
          {isLoaded && !searchCenter.lat && <PlacesAutocomplete setSearchCenter={setSearchCenter}/>}
        </div>
      </div>

      <div className="lake-map-container">
        {isLoaded && 
          lake.lat &&
          <GoogleMap
            zoom={15}
            center={{lat: lake.lat, lng: lake.lng}} 
            mapContainerClassName="lake-map">
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
      </div>
      
      {lake.messages &&
        <div className="message-container">
          <Messages 
            setLake={setLake} 
            messages={lake.messages} 
            user={user} 
            lakeId={lake.id}
          />
        </div>
      }
      
      {lake.lake_fish && 
          <Fish
            user={user}
            lakeId={lake.id}
            setLake={setLake}
            fishes={lake.lake_fish}
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
      
      
    </div>
  )
}

export default LakeDetail