import React, { useEffect, useRef } from "react";

export default function TaskForm({
  formData,
  handleSubmit,
  handleChange,
  categories,
  handleLocation,
  handleCategoryChange,
  type = "create",
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>
          <PlacesAutocomplete
            key={formData.formatted_address}
            setLocation={handleLocation}
            formatted_address={formData.formatted_address}
          />
          {categories && (
            <div>
              <label className="block font-medium text-gray-700">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">
              Number of Volunteers Needed
            </label>
            <input
              type="number"
              name="required_volunteers_count"
              value={formData.required_volunteers_count}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of volunteers"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Skills Needed
            </label>
            <input
              type="text"
              name="required_skills"
              value={formData.required_skills}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter required skills (comma-separated)"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          cols={4}
          rows={10}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description"
        />
      </div>
      <div
        className="custom-file-container"
        data-upload-id="my-unique-id"
      ></div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
      >
        {type == "create" ? "Create" : "Update"} Task
      </button>
    </form>
  );
}

const PlacesAutocomplete = ({ setLocation, formatted_address }) => {
  const autocompleteRef = useRef(null);
  const [address, setAddress] = React.useState(formatted_address);
  const [selectedPlace, setSelectedPlace] = React.useState(null);

  console.log(address);

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
