import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { Location } from '../../types';
import { getAddressFromCoordinates } from '../../services/addressService';
import './LocationPicker.css';

interface LocationPickerProps {
  onLocationSelect: (location: Location, address: string) => void;
  initialLocation?: Location;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

// Default center - Cairo, Egypt
const defaultCenter = {
  lat: 30.0444,
  lng: 31.2357,
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ['places'];

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    initialLocation || defaultCenter
  );
  const [mapCenter, setMapCenter] = useState<Location>(initialLocation || defaultCenter);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const onMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const location = { lat, lng };

        setSelectedLocation(location);
        setIsLoadingAddress(true);

        try {
          const address = await getAddressFromCoordinates(lat, lng);
          onLocationSelect(location, address);
        } catch (error) {
          console.error('Error getting address:', error);
          onLocationSelect(location, '');
        } finally {
          setIsLoadingAddress(false);
        }
      }
    },
    [onLocationSelect]
  );

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setSelectedLocation(location);
          setMapCenter(location);

          if (mapRef.current) {
            mapRef.current.panTo(location);
          }

          setIsLoadingAddress(true);
          try {
            const address = await getAddressFromCoordinates(location.lat, location.lng);
            onLocationSelect(location, address);
          } catch (error) {
            console.error('Error getting address:', error);
            onLocationSelect(location, '');
          } finally {
            setIsLoadingAddress(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const onPlaceChanged = () => {
    if (searchBox !== null) {
      const place = searchBox.getPlace();

      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        setSelectedLocation(location);
        setMapCenter(location);

        if (mapRef.current) {
          mapRef.current.panTo(location);
        }

        const address = place.formatted_address || '';
        onLocationSelect(location, address);
      }
    }
  };

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setSearchBox(autocomplete);
  };

  if (loadError) {
    return <div className="location-picker-error">Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div className="location-picker-loading">Loading map...</div>;
  }

  return (
    <div className="location-picker">
      <div className="location-picker-controls">
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search for a location..."
            className="location-search-input"
          />
        </Autocomplete>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="current-location-btn"
          disabled={isLoadingAddress}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Use Current Location
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker position={selectedLocation} />
      </GoogleMap>

      {isLoadingAddress && (
        <div className="loading-address-overlay">Getting address...</div>
      )}

      <p className="location-picker-hint">
        Click on the map to select a location, use current location, or search for a place
      </p>
    </div>
  );
};

export default LocationPicker;
