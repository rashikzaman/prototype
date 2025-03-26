import React from "react";
import { Search, MapPin, Filter, Heart } from "lucide-react";
import Link from "next/link";
import useAPI from "@/api/useAPI";
import { toast } from "react-toastify";

export default function PostCard({ opp, handleApply }) {
  return (
    <div
      key={opp.id}
      className="bg-white border rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow masonry-item"
    >
      {/* Volunteer Card Image */}
      {opp.media && opp.media.length > 0 && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_HOST}${opp.media[0].link}`}
          alt={opp.title}
          className="w-full h-auto object-cover rounded-md mb-4"
          width={"100"}
          height={"100"}
        />
      )}

      <h2 className="text-xl font-bold text-blue-700 mb-2">
        <Link href={`/tasks/${opp.id}`}>{opp.title}</Link>
      </h2>

      <div className="flex items-center text-gray-500 mb-3">
        <MapPin className="mr-2 w-5 h-5" />
        <span>{opp.formatted_address}</span>
      </div>

      <div className="flex items-center text-gray-500 mb-3">
        <Filter className="mr-2 w-5 h-5" />
        <span>{opp.category.name}</span>
      </div>

      <p className="text-sm text-gray-700 mb-4">{opp.description}</p>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Heart className="mr-2 w-5 h-5 text-red-500" />
          <span>
            {opp.subscribed_users ? opp.subscribed_users.length : 0}/
            {opp.required_volunteers_count} Volunteers
          </span>
        </div>
        {!opp.is_subscribed ? (
          <button
            className="bg-blue-600 text-white text-sm px-2 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => handleApply(opp.id)}
          >
            Apply Now
          </button>
        ) : (
          <span>Already Applied</span>
        )}
      </div>
    </div>
  );
}
