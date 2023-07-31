import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import Messages from './Messages'
import Reviews from "./Reviews"
import AddFavorite from "./AddFavorite"

function LakeDetail({ user, isLoaded, setUser }) {

  const { id } = useParams()
  
  const [error, setError] = useState('')
  const [lake, setLake] = useState([])

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
  }, [id])

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
      {isLoaded && 
        lake.lat &&
        <GoogleMap 
          zoom={15} 
          center={{lat: lake.lat, lng: lake.lng}} 
          mapContainerClassName="map">
          <MarkerF position={{lat: lake.lat, lng: lake.lng}} />
        </GoogleMap>
      }
      
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
    </div>
  )
}

export default LakeDetail