import { useMemo, useState } from 'react'
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import usePlacesAutocomplete, { getGeocode, getLatLng} from 'use-places-autocomplete'

function SimpleMap() {
  
  let center = useMemo(() => ({lat: 37, lng: -96}), [])
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <PlacesAutocomplete setSelected={setSelected}/>
      <GoogleMap 
        zoom={5} 
        center={center} 
        mapContainerClassName="map-container">
          {selected && <MarkerF position={selected}/>}
      </GoogleMap>
    </div>
  )
}

export default SimpleMap


const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: {Status, data},
    clearSuggestions
  } = usePlacesAutocomplete()

  const selectHandler = async (address) => {
    setValue(address, false)
    clearSuggestions()

    const results = await getGeocode({address})
    const {lat, lng} = await getLatLng(results[0])
    setSelected({lat, lng})
  }

  return (
    <>
      <input 
        value={value} 
        onChange={(e => setValue(e.target.value))} 
        disabled={!ready} 
        placeholder='Search an Address' 
        className='address-input'
      />
    </>
  )
}