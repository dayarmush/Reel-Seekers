import { useMemo, useState } from 'react'
import DirectionsHandler from './Directions';
import PlacesAutocomplete from './PlacesAutocomplete'
import { GoogleMap, MarkerF } from '@react-google-maps/api'

function SimpleMap({ lakes }) {

  const [selectedMarker, setSelectedMarker] = useState([])
  
  let center = useMemo(() => ({lat: 39, lng: -98}), [])

  function markerClick(marker) {
    setSelectedMarker(marker);
  }

  return (
    <div>
      <PlacesAutocomplete />
      <GoogleMap 
        zoom={4.5} 
        center={center} 
        mapContainerClassName="map">
        {lakes && lakes.map(lake => {
          return <MarkerF 
            position={{lat: lake.lat, lng: lake.lng}} 
            key={lake.id} 
            onClick={() => markerClick(lake)}/>
        })}
        <DirectionsHandler center={center} selectedMarker={selectedMarker} />
      </GoogleMap>
    </div>
  )
}

export default SimpleMap