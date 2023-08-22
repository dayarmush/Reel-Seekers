import '../style/NewLake.css'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete from "./PlacesAutocomplete"
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { getGeocode, getLatLng } from 'use-places-autocomplete';

function NewLake({ isLoaded, lakes, setLakes }) {

  const navigate = useNavigate()
  let center = useMemo(() => ({lat: 39, lng: -98}), [])

  const [error, setError] = useState('')
  const [hasForm, setHasForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value
    setFormData(pre => {
      return {...pre, [key]: value}
    });
  };

  const autoFill = async (address) => {
    try {
      // get all address info out of address string
      const results = await getGeocode({ address });
      if (results && results.length > 0) {
        // get the lat lng out of result
        const { lat, lng } = await getLatLng(results[0]);
        setFormData({
          // address: results[0].address_components[0].long_name + ' ' + results[0].address_components[1].long_name,
          lat: lat,
          lng: lng,
          // city: results[0].address_components[3].long_name,
          // state: results[0].address_components.length >= 5 ? results[0].address_components[5].long_name : '',
          // zip_code: results[0].address_components.length >= 7 ? results[0].address_components[7].short_name : '',
        });
        setHasForm(pre => !pre)
      }
    } catch (error) {
      console.log('Error getting geocode:', error);
    }
  }

  function handleMapClick(e) {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setFormData({'lat': lat, 'lng': lng})
    setHasForm(pre => !pre)
  }

  // Add to pending lakes array
  const handleSubmit = async (e) => {
    e.preventDefault()

    const alreadyExists = lakes.filter(lake => {
      return lake.lat === formData.lat && lake.lng === formData.lng
    })

    if (alreadyExists[0]) return setError('Lake Already Exists. (May Be Pending)')

    try {
      const response = await fetch('/lakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) { 
        const data = await response.json()
        setLakes(pre => [...pre, data]);
        setError('Thanks For Contributing');
        setTimeout(() => navigate('/user'), 1000);
      } else {
        const err = await response.json()
        if (err.name === 'IntegrityError') return setError('A lake with this name or coordinates already exists')
        setError(err.error)
      }
    } catch (err) {
      setError('Network Error. Please try again later.')
    }
  }
  
  return (
    <div className='new-lake-container'>
      {isLoaded &&
        !hasForm &&
        <div>
          <PlacesAutocomplete from={'lake'} func={autoFill}/>
        </div>
      }

      {isLoaded && 
        <GoogleMap
          zoom={5}
          center={center} 
          onClick={handleMapClick}
          mapContainerClassName="lake-map">
            {formData.lat && <MarkerF position={{lat: formData.lat, lng: formData.lng}}/>}
        </GoogleMap>
      }
      
      {hasForm && 
        <div className='lake-form-container'>
          {error && <h4 className='lake-form-error'>{error}</h4>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" className='lake-form-label'>Name:</label>
            <input 
              required 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              className='lake-form-input'
            />
            <br />

            <label htmlFor="address" className='lake-form-label'>Address:</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
              onChange={handleChange} 
              value={formData.address}
              className='lake-form-input'
            />
            <br />

            <label htmlFor="city" className='lake-form-label'>City:</label>
            <input 
              type="text" 
              id="city" 
              name="city" 
              value={formData.city}
              onChange={handleChange}
              className='lake-form-input'
            />
            <br />

            <label htmlFor="state" className='lake-form-label'>State:</label>
            <input 
              type="text" 
              id="state" 
              name="state" 
              value={formData.state}
              onChange={handleChange}
              className='lake-form-input' 
            />
            <br />

            <label htmlFor="zip_code" className='lake-form-label'>Zip Code:</label>
            <input 
              type="text" 
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              className='lake-form-input'
            />
            <br />

            <button type="submit" className='lake-form-button'>Submit</button>
          </form>
        </div> 
      }
    </div>
        
  )
}

export default NewLake