import { useMemo, useState } from 'react'
// import DirectionsHandler from './Directions'
import { useNavigate } from 'react-router-dom'
import PlacesAutocomplete from './PlacesAutocomplete'
import { GoogleMap, MarkerF } from '@react-google-maps/api'

function SimpleMap({ lakes, searchCenter, setSearchCenter }) {

  // const [searchCenter, setSearchCenter] = useState({})
  // const [selectedMarker, setSelectedMarker] = useState([])
  // const [hasDirections, setHasDirections] = useState(false)
  
  const navigate = useNavigate()
  let center = useMemo(() => ({lat: 39, lng: -98}), [])

  function markerClick(marker) {
    navigate(`lake/${marker.id}`)
    // setHasDirections(true)
    // setSelectedMarker(marker);
  }

  const pendingFilter = lakes.filter(lake => {
    return lake.status !== 'pending'
  })

  return (
    <div>
      <PlacesAutocomplete setSearchCenter={setSearchCenter}/>
      <GoogleMap 
        zoom={searchCenter.lat ? 6 : 4.5} 
        center={searchCenter.lat ? searchCenter : center} 
        mapContainerClassName="map">
        {lakes && pendingFilter.map(lake => {
          return <MarkerF 
            position={{lat: lake.lat, lng: lake.lng}} 
            key={lake.id} 
            onClick={() => markerClick(lake)}/>
        })}
        {/* {hasDirections && <DirectionsHandler center={searchCenter.lat ? searchCenter : center} selectedMarker={selectedMarker} />} */}
      </GoogleMap>
    </div>
  )
}

export default SimpleMap