import { Input, Box, List, ListItem } from "@chakra-ui/react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const PlacesAutocomplete = ({ from, func, setSearchCenter}) => {
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
    console.log(results)
    // get the lat lng out of result
    const {lat, lng} = await getLatLng(results[0])
    // set the selected to lat lng
    setSearchCenter({lat, lng})
  }

  return (
    <Box>
      <Input
        value={value}
        onChange={(e => setValue(e.target.value))} 
        disabled={!ready} 
        placeholder='Search For Lake' 
        className='address-input'
      />
      {/* remove function from list components */}
      <List>
        {status === 'OK' && 
          data.map(({place_id, description}) => {
            return (
              <ListItem 
                key={place_id} 
                onClick={from === 'lake' ? () => { 
                return func(description), 
                        clearSuggestions(), 
                        setValue(description, false)} : 
                        () => selectHandler(description)}>
                        {description}
              </ListItem>
          )})
        }
      </List>
    </Box>
      
  )
}

export default PlacesAutocomplete