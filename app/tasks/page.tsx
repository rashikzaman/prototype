"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Filter, Heart, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Post from "@/components/Post/PostCard";
import ReactPaginate from "react-paginate";
import { useQueries, useQuery } from "@tanstack/react-query";
import useAPI from "@/api/useAPI";
import { toast } from "react-toastify";

const VolunteerConnect = () => {
  const { fetchTasks, fetchCategories, fetchSkills, applyToTask } = useAPI();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [isRequested, setIsRequested] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // ReactPaginate uses zero-based indexing
  const perPage = 10;

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setIsRequested(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCheckboxChange = (value, setter, state) => {
    if (state.includes(value)) {
      setter(state.filter((item) => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // ReactPaginate returns the selected page index
  };

  const results = useQueries({
    queries: [
      {
        queryKey: [
          "tasks",
          selectedCategories,
          selectedSkills,
          currentPage,
          searchTerm,
        ],
        queryFn: () =>
          fetchTasks(currentPage + 1, perPage, {
            category_ids: selectedCategories,
            skills: selectedSkills,
            latitude: location.lat,
            longitude: location.lng,
            is_subscribed: true,
            search_term: searchTerm,
          }),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        enabled: location != null,
      },
      {
        queryKey: ["categories"],
        queryFn: () => fetchCategories(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["skills"],
        queryFn: () => fetchSkills(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
      },
    ],
  });

  const [tasksQuery, categoriesQuery, skillsQuery] = results;

  const pageCount = useMemo(() => {
    return tasksQuery.data ? Math.ceil(tasksQuery.data.count / perPage) : 0;
  }, [tasksQuery.data?.count]);

  const handleApply = async (id) => {
    try {
      await applyToTask(id);
      toast("Applied successfully", { type: "success" });
      tasksQuery.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to apply", { type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            {!isRequested ? (
              <div>
                <p>We need your location to provide better service.</p>
                <button onClick={getLocation}>Share Location</button>
              </div>
            ) : error ? (
              <div className="error">
                <p>
                  We are unable to get your location. Please try again! {error}
                </p>
                <button onClick={getLocation}>Try Again</button>
              </div>
            ) : location ? (
              <div></div>
            ) : (
              <p></p>
            )}

            <h3 className="text-sm font-bold mb-4">Filter by Category</h3>
            {categoriesQuery.data &&
              categoriesQuery.data.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={cat.name}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() =>
                        handleCheckboxChange(
                          cat.id,
                          setSelectedCategories,
                          selectedCategories
                        )
                      }
                      className="mr-2"
                    />
                    {cat.name}
                  </label>
                </div>
              ))}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-bold mb-4">Filter by Skill</h3>
            {skillsQuery.data &&
              skillsQuery.data.map((skill) => (
                <div key={skill} className="mb-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      value={skill}
                      checked={selectedSkills.includes(skill)}
                      onChange={() => {
                        handleCheckboxChange(
                          skill,
                          setSelectedSkills,
                          selectedSkills
                        );
                      }}
                      className="mr-2"
                    />
                    {skill}
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

            <button className="bg-green-600 text-white text-sm px-6 py-2 rounded-md hover:bg-blue-700 transition">
              <Link href="/tasks/new">New Task</Link>
            </button>
          </div>

          {tasksQuery.data && tasksQuery.data && (
            <>
              <div className="masonry-wrapper">
                <div className="masonry-grid">
                  {tasksQuery.data.records.map((opp) => (
                    <Post key={opp.id} opp={opp} handleApply={handleApply} />
                  ))}
                </div>
              </div>
            </>
          )}

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={`flex justify-center mt-8 space-x-2 ${
              tasksQuery.isPending ? "hidden" : ""
            }`}
            pageClassName={"px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"}
            activeClassName={"bg-blue-500 text-white"}
            previousClassName={
              "px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            }
            nextClassName={"px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"}
            breakClassName={"px-4 py-2"}
            disabledClassName={"opacity-50 cursor-not-allowed"}
          />
        </div>
      </div>
    </div>
  );
};

export default VolunteerConnect;
