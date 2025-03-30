import { useState, useEffect, useRef } from "react";

const PlacesAutocomplete = ({ setLocation, formatted_address }) => {
  const autocompleteRef = useRef(null);
  const [address, setAddress] = useState(formatted_address);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not loaded");
      return;
    }

    if (autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["geocode"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setSelectedPlace(place);
        if (place && place.formatted_address) {
          setSelectedPlace(place);
          setAddress(place.formatted_address);
          setLocation(place);
        }
      });

      // clean the event listener when component is unmounted
      return () => {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      };
    }
  }, []);

  return (
    <div>
      <label className="block font-medium text-gray-700">Location</label>
      <input
        type="text"
        name="formatted_address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter location"
        required
        ref={autocompleteRef}
      />
    </div>
  );
};

export default PlacesAutocomplete;
