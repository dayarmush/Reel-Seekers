import usePlacesAutocomplete, { getGeocode, getLatLng, getDetails } from 'use-places-autocomplete';
import { Input, Box, List, ListItem, ListIcon } from "@chakra-ui/react";
import axios from 'axios'

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    // data has the autocomplete addresses and status is ok or not
    suggestions: {status, data},
    clearSuggestions
  } = usePlacesAutocomplete()

  const selectHandler = async (address) => {
    console.log(address)
    setValue(address, false)
    clearSuggestions()
    // turn address into lat lng 
    const results = await getGeocode({address})
    // get the lat lng out of result
    const {lat, lng} = await getLatLng(results[0])
    // set the selected to lat lng
    // setSelected({lat, lng})

    try {
      // get lat lng out of address
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_API_KEY}`
      );
      console.log(response)
      // this is the adress
      const formattedAddress = response.data.results[0]?.formatted_address;
      console.log('Reverse Geocoded Address:', formattedAddress);
      // store the formatted address in state or use it as needed.
    } catch (error) {
      console.log('Error getting reverse geocode:', error);
    }
  }

  return (
    <Box>
      <Input
        value={value}
        onChange={(e => setValue(e.target.value))} 
        disabled={!ready} 
        placeholder='Search an Address' 
        className='address-input'
      />
      <List  onSelect={selectHandler}>
        {status === 'OK' && data.map(({place_id, description}) => {
          return <ListItem key={place_id} onClick={() => selectHandler(description)}>{description}</ListItem>
        })}
      </List>
    </Box>
      
  )
}

export default PlacesAutocomplete