import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PlacesAutocomplete from "./PlacesAutocomplete"
import { getGeocode, getLatLng } from 'use-places-autocomplete';

function NewLake({ isLoaded, lakes, setLakes }) {

  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
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
        console.log(results)
        const { lat, lng } = await getLatLng(results[0]);
        setFormData({
          address1: results[0].address_components[0].long_name + ' ' + results[0].address_components[1].long_name,
          lat: lat,
          lng: lng,
          city: results[0].address_components[3].long_name,
          state: results[0].address_components.length >= 5 ? results[0].address_components[5].long_name : '',
          zip_code: results[0].address_components.length >= 7 ? results[0].address_components[7].short_name : '',
        });
      }
    } catch (error) {
      console.log('Error getting geocode:', error);
    }
  }

  // Add to pending array
  const handleSubmit = (e) => {
    e.preventDefault()

    const alreadyExists = lakes.filter(lake => {
      return lake.lat === formData.lat && lake.lng === formData.lng
    })

    if (alreadyExists[0]) return setError('Lake Already Exists. (May Be Pending)')

    fetch('/lakes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(r => {
      if (r.ok) {
        r.json()
        .then(data => {
          setLakes(pre => [...pre, data])
          setError('Thanks For Contributing')
        })
      } else {
        r.json()
        .then(err => setError(err.error))
      }
    })
    .catch(err => console.error('Network Error. Please try again later.'))

    return setTimeout(() => {
      navigate('/user')
    }, 1000)
  }

  return (
    <div>
      {isLoaded &&
        <PlacesAutocomplete from={'lake'} func={autoFill}/>
      }
      {error && <h1>{error}</h1>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
        <br />

        <label htmlFor="address1">Address:</label>
        <input 
          type="text" 
          id="address1" 
          name="address1" 
          value={formData.address1}
          onChange={handleChange} 
          required
        />
        <br />

        <label htmlFor="city">City:</label>
        <input 
          type="text" 
          id="city" 
          name="city" 
          value={formData.city}
          onChange={handleChange} 
        />
        <br />

        <label htmlFor="state">State:</label>
        <input 
          type="text" 
          id="state" 
          name="state" 
          value={formData.state}
          onChange={handleChange} 
        />
        <br />

        <label htmlFor="zip_code">Zip Code:</label>
        <input 
          type="text" 
          id="zip_code"
          name="zip_code"
          value={formData.zip_code}
          onChange={handleChange} 
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default NewLake