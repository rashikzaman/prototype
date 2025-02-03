"use client";

import React, { useState } from "react";
import Editor from "react-simple-wysiwyg";

const CreateVolunteerTask = () => {
  const [html, setHtml] = useState('<div style="height: 100px">my <b>HTML</b></div>');
  const categories = ["Environment", "Community", "Education", "Animals"];

  function onChange(e) {
    setHtml(e.target.value);
  }

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    location: "",
    category: "",
    description: "",
    requiredVolunteers: "",
    skillsNeeded: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Volunteer Task Created:", formData);
      setSubmitted(true);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const validateForm = () => {
    return (
      formData.title &&
      formData.organization &&
      formData.location &&
      formData.category &&
      formData.description &&
      formData.requiredVolunteers
    );
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
          {/* Two-column grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
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

              <div>
                <label className="block font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700">
                  Category
                </label>
                <select
                  onChange={(e) => {}}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Number of Volunteers Needed
                </label>
                <input
                  type="number"
                  name="requiredVolunteers"
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
                  name="skillsNeeded"
                  value={formData.skillsNeeded}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter required skills (comma-separated)"
                />
              </div>
            </div>
          </div>

          {/* Full-width Description Editor */}
          <div>
            <label className="block font-medium text-gray-700">
              Description
            </label>
            <Editor value={html} onChange={onChange} />
          </div>

          {/* Full-width Submit Button */}
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

export default CreateVolunteerTask;