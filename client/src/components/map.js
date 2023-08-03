import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, MarkerF } from '@react-google-maps/api'

function SimpleMap({ lakes, searchCenter }) {

  const navigate = useNavigate()
  let center = useMemo(() => ({lat: 39, lng: -98}), [])

  function markerClick(marker) {
    navigate(`lake/${marker.id}`)
  }

  const pendingFilter = lakes.filter(lake => {
    return lake.status !== 'pending'
  })

  return (
    <div>
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
      </GoogleMap>
    </div>
  )
}

export default SimpleMap