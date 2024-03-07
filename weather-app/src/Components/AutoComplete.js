import React, { useState } from 'react';
import { GoogleMap, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const AutoCompleteDropdown = () => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [place, setPlace] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      setPlace(autocomplete.getPlace());
    }
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        id="autocomplete-map"
        mapContainerStyle={{
          height: '400px',
          width: '100%',
        }}
        zoom={1}
        center={{
          lat: 0,
          lng: 0,
        }}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input type="text" placeholder="Search for a place" />
        </Autocomplete>
      </GoogleMap>

      {place && (
        <div>
          <p>Selected Place:</p>
          <pre>{JSON.stringify(place, null, 2)}</pre>
        </div>
      )}
    </div>
  ) : null;
};

export default AutoCompleteDropdown;
