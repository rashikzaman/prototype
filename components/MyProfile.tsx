"use client";

import React, { useState } from "react";
import { useUser } from "./Provider/UserProvider";
import useAPI from "@/api/useAPI";
import { toast } from "react-toastify";
import PlacesAutocomplete from "./PlaceAutoComplete";

export default function MyProfile() {
  const { user } = useUser();
  const { updateProfile } = useAPI();

  console.log(user);

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    formatted_address: user.user_location?.formatted_address || "",
    latitude: user.user_location?.latitude || "",
    longitude: user.user_location?.longitude || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile(formData);
      toast("Profile updated successfully", { type: "success" });
    } catch (e) {
      toast("Failed to update the profile, please try again later!", {
        type: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocation = (place: any) => {
    if (place && place.formatted_address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_location: {
          formatted_address: place.formatted_address,
          latitude: place.geometry?.location.lat(),
          longitude: place.geometry?.location.lng(),
        },
      }));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">My Profile</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">First Name:</p>
            <p className="font-medium">{user.first_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Name:</p>
            <p className="font-medium">{user.last_name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600">Phone Number:</p>
            <p className="font-medium">{user.phone_number || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number ?? ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
          </div>
          <PlacesAutocomplete
            setLocation={handleLocation}
            formatted_address={formData.formatted_address}
          />
          {/* SMS Notification Checkbox */}
          <div className="my-4 flex items-center">
            <input
              type="checkbox"
              id="receive_sms_notifications"
              name="receive_sms_notifications"
             // checked={formData.receive_sms_notifications}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="receive_sms_notifications"
              className="ml-2 block text-gray-700"
            >
              Receive SMS notifications when new tasks are created in your area
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
