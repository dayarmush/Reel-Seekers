import React, { useState, useEffect } from 'react';
import { DirectionsRenderer } from '@react-google-maps/api'; // Replace with the correct import statement for your map library

function DirectionsHandler({ center, selectedMarker }) {
  
  const [directions, setDirections] = useState(null);

  useEffect(() => {
     // No selected marker, don't fetch directions
    if (!selectedMarker) return;
    // Fetch directions from the center to the selected marker
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(center.lat, center.lng),
        destination: new window.google.maps.LatLng(
          selectedMarker.lat,
          selectedMarker.lng
        ),
        travelMode: 'DRIVING',
      },
      (result, status) => {
        if (status === 'OK') {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  }, [center, selectedMarker]);

  const customRouteStyles = {
    polylineOptions: {
      strokeColor: '#1E90FF', // Change the color here to make the line darker
      strokeWeight: 7, // adjust the line thickness
    },
  };

  return directions ? <DirectionsRenderer directions={directions} options={customRouteStyles} /> : null;
}

export default DirectionsHandler;
