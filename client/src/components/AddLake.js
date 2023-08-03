import { useState } from 'react'
import PlacesAutocomplete from "./PlacesAutocomplete"
import { getGeocode, getLatLng } from 'use-places-autocomplete';

function AddLake({ isLoaded }) {

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
        const { lat, lng } = await getLatLng(results[0]);
        setFormData({
          address1: results[0].address_components[0].long_name + ' ' + results[0].address_components[1].short_name,
          lat: lat,
          lng: lng,
          city: results[0].address_components[3].long_name,
          state: results[0].address_components[5].long_name,
          zip_code: results[0].address_components[7].long_name
        });
      }
    } catch (error) {
      console.log('Error getting geocode:', error);
    }
  }

  // Add to pending array
  const handleSubmit = (e) => {
    e.preventDefault()

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
        .then(data => console.log(data))
      } else {
        r.json()
        .then(err => console.log(err.error))
      }
    })
    .catch(err => console.error('Network Error. Please try again later.'))
  }

  return (
    <div>
      {isLoaded &&
        <PlacesAutocomplete from={'lake'} func={autoFill}/>
      }

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
          required
          readOnly
        />
        <br />

        <label htmlFor="city">City:</label>
        <input 
          type="text" 
          id="city" 
          name="city" 
          value={formData.city}
          readOnly
        />
        <br />

        <label htmlFor="state">State:</label>
        <input 
          type="text" 
          id="state" 
          name="state" 
          value={formData.state}
          readOnly
        />
        <br />

        <label htmlFor="zip_code">Zip Code:</label>
        <input 
          type="text" 
          id="zip_code"
          name="zip_code"
          value={formData.zip_code}  
          required
          readOnly
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default AddLake