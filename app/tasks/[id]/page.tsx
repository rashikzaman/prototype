"use client";

import React from "react";
import { MapPin, Filter, Heart } from "lucide-react";
import Image from "next/image";
import { PostModel } from "@/models/Post";

const SinglePostPage = () => {
  const post = {
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
  };

  return (
    <div className="container mx-auto p-4">
      {/* Post Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">{post.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{post.organization}</p>

        <div className="flex items-center text-gray-500 mb-2">
          <MapPin className="mr-2 w-5 h-5" />
          <span>{post.location}</span>
        </div>

        <div className="flex items-center text-gray-500 mb-4">
          <Filter className="mr-2 w-5 h-5" />
          <span>{post.category}</span>
        </div>
      </div>

      {/* Post Image */}
      {post.imageUrl && post.imageUrl.length > 0 && (
        <div>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg"
                alt=""
              ></img>
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg"
                alt=""
              ></img>
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg"
                alt=""
              ></img>
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg"
                alt=""
              ></img>
            </div>
            <div>
              <img
                className="h-auto max-w-full rounded-lg"
                src="https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg"
                alt=""
              ></img>
            </div>
          </div>
        </div>
      )}

      {/* Post Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">About This Task</h2>
        <p className="text-gray-700 mb-4">{post.description}</p>

        <h3 className="text-lg font-semibold mb-2">Skills Needed</h3>
        <ul className="list-disc list-inside mb-4">
          {post.skillsNeeded.map((skill, index) => (
            <li key={index} className="text-gray-700">
              {skill}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mb-2">Volunteers Needed</h3>
        <p className="text-gray-700">{post.requiredVolunteers} Volunteers</p>
      </div>

      {/* Action Section */}
      <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center">
        <div className="flex items-center">
          <Heart className="mr-2 w-5 h-5 text-red-500" />
          <span className="text-gray-700">
            {post.currentVolunteers}/{post.requiredVolunteers} Volunteers
          </span>
        </div>
        <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default SinglePostPage;
