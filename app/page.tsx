"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Filter, Heart, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Post from "@/components/Post/PostCard";

// Mock volunteer data
const volunteerData = [
  {
    id: 1,
    title: "Beach Cleanup",
    organization: "Ocean Guardians",
    location: "San Francisco, CA",
    category: "Environment",
    description:
      "Help us clean up local beaches and protect marine ecosystems.",
    requiredVolunteers: 20,
    currentVolunteers: 12,
    skillsNeeded: ["Physical Labor", "Environmental Awareness"],
    imageUrl: ["https://placehold.co/600x400"],
  },
  {
    id: 2,
    title: "Senior Companion Program",
    organization: "Golden Years Foundation",
    location: "Oakland, CA",
    category: "Community",
    description:
      "Spend time with elderly residents, providing companionship and support.",
    requiredVolunteers: 15,
    currentVolunteers: 8,
    skillsNeeded: ["Empathy", "Communication"],
    imageUrl: ["https://placehold.co/600x400"],
  },
  {
    id: 3,
    title: "Youth Tutoring",
    organization: "Education Uplift",
    location: "San Jose, CA",
    category: "Education",
    description: "Help students with homework and provide academic mentorship.",
    requiredVolunteers: 25,
    currentVolunteers: 18,
    skillsNeeded: ["Teaching", "Patience"],
  },
  {
    id: 4,
    title: "Animal Shelter Support",
    organization: "Paws and Claws",
    location: "Sacramento, CA",
    category: "Animals",
    description:
      "Care for rescued animals, assist with feeding and socialization.",
    requiredVolunteers: 10,
    currentVolunteers: 5,
    skillsNeeded: ["Animal Handling", "Compassion"],
  },
  {
    id: 5,
    title: "Community Garden Project",
    organization: "Green Urban Spaces",
    location: "Berkeley, CA",
    category: "Environment",
    description:
      "Help develop and maintain community gardens to promote local food production and green spaces.",
    requiredVolunteers: 30,
    currentVolunteers: 22,
    skillsNeeded: ["Gardening", "Physical Labor", "Team Work"],
    imageUrl: ["https://placehold.co/600x200"],
  },
  {
    id: 6,
    title: "Digital Literacy for Seniors",
    organization: "Tech Connect",
    location: "Palo Alto, CA",
    category: "Education",
    description:
      "Teach basic computer and smartphone skills to seniors in community centers.",
    requiredVolunteers: 15,
    currentVolunteers: 10,
    skillsNeeded: ["Tech Savvy", "Patience", "Communication"],
  },
  {
    id: 7,
    title: "Homeless Meal Preparation",
    organization: "City Compassion Network",
    location: "San Francisco, CA",
    category: "Community",
    description:
      "Help prepare and distribute meals to homeless individuals in local shelters.",
    requiredVolunteers: 40,
    currentVolunteers: 28,
    skillsNeeded: ["Cooking", "Food Safety", "Empathy"],
    imageUrl: "https://placehold.co/600x500",
  },
  {
    id: 8,
    title: "Wildlife Conservation Research",
    organization: "Nature Preserve Institute",
    location: "Santa Cruz, CA",
    category: "Environment",
    description:
      "Assist researchers in tracking local wildlife, collecting data, and supporting conservation efforts.",
    requiredVolunteers: 20,
    currentVolunteers: 12,
    skillsNeeded: ["Observation", "Patience", "Nature Appreciation"],
  },
  {
    id: 9,
    title: "Art Therapy for Children",
    organization: "Healing Brushstrokes",
    location: "San Jose, CA",
    category: "Community",
    description:
      "Support art therapy sessions for children in hospitals and community centers.",
    requiredVolunteers: 25,
    currentVolunteers: 16,
    skillsNeeded: ["Creativity", "Patience", "Child Interaction"],
  },
  {
    id: 10,
    title: "ESL Language Exchange",
    organization: "Global Voices",
    location: "Oakland, CA",
    category: "Education",
    description:
      "Help immigrants and refugees improve their English language skills through conversation and cultural exchange.",
    requiredVolunteers: 35,
    currentVolunteers: 25,
    skillsNeeded: ["Communication", "Cultural Sensitivity", "Language Skills"],
  },
  {
    id: 11,
    title: "Disaster Relief Preparation",
    organization: "Community Emergency Response",
    location: "San Francisco, CA",
    category: "Community",
    description:
      "Train and prepare volunteers for local emergency response and disaster relief efforts.",
    requiredVolunteers: 50,
    currentVolunteers: 35,
    skillsNeeded: ["First Aid", "Physical Fitness", "Problem Solving"],
  },
  {
    id: 12,
    title: "Youth Mentorship Program",
    organization: "Future Leaders Academy",
    location: "Sacramento, CA",
    category: "Education",
    description:
      "Provide guidance, support, and mentorship to at-risk youth in local communities.",
    requiredVolunteers: 30,
    currentVolunteers: 20,
    skillsNeeded: ["Counseling", "Active Listening", "Motivation"],
  },
];

const VolunteerConnect = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] =
    useState(volunteerData);

  // Filter opportunities based on search criteria
  useEffect(() => {
    const results = volunteerData.filter(
      (opp) =>
        (searchTerm === "" ||
          opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedLocations.length === 0 ||
          selectedLocations.includes(opp.location.split(", ")[1])) &&
        (selectedCategories.length === 0 ||
          selectedCategories.includes(opp.category))
    );
    setFilteredOpportunities(results);
  }, [searchTerm, selectedLocations, selectedCategories]);

  // Extract unique locations and categories
  const uniqueLocations = [
    ...new Set(volunteerData.map((opp) => opp.location.split(", ")[1])),
  ];
  const uniqueCategories = [
    ...new Set(volunteerData.map((opp) => opp.category)),
  ];
  const uniqueSkills = [
    ...new Set(volunteerData.flatMap((opp) => opp.skillsNeeded)),
  ];

  const handleCheckboxChange = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-sm font-bold mb-4">Filter by Location</h3>
            {uniqueLocations.map((loc) => (
              <div key={loc} className="mb-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    value={loc}
                    checked={selectedLocations.includes(loc)}
                    onChange={() =>
                      handleCheckboxChange(
                        loc,
                        setSelectedLocations,
                        selectedLocations
                      )
                    }
                    className="mr-2"
                  />
                  {loc}
                </label>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-sm font-bold mb-4">Filter by Category</h3>
            {uniqueCategories.map((cat) => (
              <div key={cat} className="mb-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      handleCheckboxChange(
                        cat,
                        setSelectedCategories,
                        selectedCategories
                      )
                    }
                    className="mr-2"
                  />
                  {cat}
                </label>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-bold mb-4">Filter by Skill</h3>
            {uniqueSkills.map((cat) => (
              <div key={cat} className="mb-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    value={cat}
                    // checked={selectedCategories.includes(cat)}
                    onChange={() => {
                      // handleCheckboxChange(
                      //   cat,
                      //   setSelectedCategories,
                      //   selectedCategories
                      // );
                    }}
                    className="mr-2"
                  />
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Search Input */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search volunteer opportunities"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <select
              onChange={(e) => {}}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Most Recent</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <button className="bg-green-600 text-white text-sm px-6 py-2 rounded-md hover:bg-blue-700 transition"><Link href="/tasks/new">New Task</Link></button>
          </div>

          {/* Opportunities Grid */}
          <div className="masonry-wrapper">
            <div className="masonry-grid">
              {filteredOpportunities.map((opp) => (
                <Post key={opp.id} opp={opp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerConnect;
