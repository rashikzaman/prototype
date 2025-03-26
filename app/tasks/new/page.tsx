"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUploadWithPreview } from "file-upload-with-preview";
import "file-upload-with-preview/dist/style.css";
import useAPI from "@/api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const CreateVolunteerTask = () => {
  const { createTask, fetchCategories } = useAPI();
  const upload = useRef(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (!upload.current) {
      upload.current = new FileUploadWithPreview("my-unique-id", {
        multiple: true,
        maxFileCount: 3,
      });
    }
  }, []);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    latitude: "",
    longitude: "",
    formatted_address: "",
    category: "",
    description: "",
    required_volunteers_count: 0,
    required_skills: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocation = (place: any) => {
    if (place && place.formatted_address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        formatted_address: place.formatted_address,
        latitude: place.geometry?.location.lat(),
        longitude: place.geometry?.location.lng(),
      }));
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  async function convertFilesToBase64(fileArray) {
    try {
      const base64Array = await Promise.all(
        fileArray.map((file) => fileToBase64(file))
      );

      return base64Array;
    } catch (error) {
      console.error("Error converting files to base64:", error);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.category_id = formData.category;
    formData.required_skills = formData.required_skills.split(",");
    formData.required_volunteers_count = Number(
      formData.required_volunteers_count
    );

    delete formData.category;

    const media = await convertFilesToBase64(upload.current.cachedFileArray);
    formData.media = media.map((m) => ({ base64: m }));

    try {
      await createTask(formData);
      toast("Task created successfully", { type: "success" });
    } catch (e) {
      toast("Failed to create the task, please try again later!", {
        type: "error",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Create an ACTLocal Task
      </h1>
      {submitted ? (
        <div className="p-4 bg-green-100 text-green-700 border border-green-300 rounded-md">
          <p>Volunteer task created successfully!</p>
        </div>
      ) : (
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
              <PlacesAutocomplete setLocation={handleLocation} />
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
                  value={formData.requiredVolunteers}
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
                  value={formData.skillsNeeded}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter required skills (comma-separated)"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Description
            </label>
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
            Create Task
          </button>
        </form>
      )}
    </div>
  );
};

const PlacesAutocomplete = ({ setLocation }) => {
  const autocompleteRef = useRef(null);
  const [address, setAddress] = React.useState("");
  const [selectedPlace, setSelectedPlace] = React.useState(null);

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

export default CreateVolunteerTask;
