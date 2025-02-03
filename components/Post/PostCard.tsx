import React from "react";
import { Search, MapPin, Filter, Heart, User } from "lucide-react";
import { PostModel } from "@/models/Post";
import Link from "next/link";

export default function PostCard({ opp }: { opp: PostModel }) {
  return (
    <div
      key={opp.id}
      className="bg-white border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow masonry-item"
    >
      {/* Volunteer Card Image */}
      {opp.imageUrl && opp.imageUrl.length > 0 && (
        <img
          src={opp.imageUrl[0]}
          alt={opp.title}
          className="w-full h-auto object-cover rounded-md mb-4"
          // alt={opp.title}
          width={"100"}
          height={"100"}
        />
      )}

      <h2 className="text-xl font-bold text-blue-700 mb-2">
        <Link href={`/tasks/${opp.id}`}>{opp.title}</Link>
      </h2>
      <p className="text-gray-600 mb-3">{opp.organization}</p>

      <div className="flex items-center text-gray-500 mb-3">
        <MapPin className="mr-2 w-5 h-5" />
        <span>{opp.location}</span>
      </div>

      <div className="flex items-center text-gray-500 mb-3">
        <Filter className="mr-2 w-5 h-5" />
        <span>{opp.category}</span>
      </div>

      <p className="text-sm text-gray-700 mb-4">{opp.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Heart className="mr-2 w-5 h-5 text-red-500" />
          <span>
            {opp.currentVolunteers}/{opp.requiredVolunteers} Volunteers
          </span>
        </div>
        <button className="bg-blue-600 text-white text-sm px-2 py-2 rounded-md hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
}
