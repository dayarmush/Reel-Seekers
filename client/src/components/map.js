import { useMemo } from 'react'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import PlacesAutocomplete from './PlacesAutocomplete'
// import { getGeocode, getLatLng } from 'use-places-autocomplete';

function SimpleMap({ lakes }) {
  
  let center = useMemo(() => ({lat: 39, lng: -98}), [])

  return (
    <div>
      <PlacesAutocomplete />
      <GoogleMap 
        zoom={4.5} 
        center={center} 
        mapContainerClassName="map">
        {lakes && lakes.map(lake => {
          return <MarkerF position={{lat: lake.lat, lng: lake.lng}} key={lake.id}/>
        })}
      </GoogleMap>
    </div>
  )
}

export default SimpleMap


// turn address into lat lng 
// const results = getGeocode()
// get the lat lng out of result
// const {lat, lng} = getLatLng(results[0])
// onClick={(e) => console.log(e.latLng.lat(), e.latLng.lng())