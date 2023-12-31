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
  const [selectedMarker, setSelectedMarker] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/lakes/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setLake(data);
        setSelectedMarker(data);
      } else {
        const err = await response.json()
        setError(err.error)
      }
    };
  
    fetchData().catch(error => {
      setError('Network Error. Please try again later.');
      setLake([])
    });
  }, [id, setLake])

  return (
    <div className="lake-details">
      {error && <h1>{error}</h1>}
      <h2>{lake.name}</h2>
      {/* {lake.address1 && <h3>{lake.address1}</h3>} */}
      <h3>{lake.city}</h3>
      <h4>{lake.state}</h4>

      <div className="favorite-container">
        <AddFavorite lakeId={lake.id} user={user} setUser={setUser}/>
      </div>
      
      {/* <div className="center-container"> */}
        <div className="lake-search-container">
          {isLoaded && <PlacesAutocomplete setSearchCenter={setSearchCenter}/>}
        </div>

      
        <div className="map-messages">
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
                  selectedMarker={selectedMarker}
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
        </div>
      {/* </div> */}
      
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