"use client";

import React, { useState } from "react";
import { Pencil, Trash } from "lucide-react";

const TaskTable = () => {
  const [activeTab, setActiveTab] = useState("created");

  const createdTasks = [
    {
      id: 1,
      title: "Beach Cleanup",
      organization: "Ocean Guardians",
      location: "San Francisco, CA",
      category: "Environment",
      requiredVolunteers: 20,
    },
    {
      id: 2,
      title: "Senior Companion Program",
      organization: "Golden Years Foundation",
      location: "Oakland, CA",
      category: "Community",
      requiredVolunteers: 15,
    },
  ];

  const involvedTasks = [
    {
      id: 3,
      title: "Youth Tutoring",
      organization: "Education Uplift",
      location: "San Jose, CA",
      category: "Education",
      requiredVolunteers: 25,
    },
    {
      id: 4,
      title: "Animal Shelter Support",
      organization: "Paws and Claws",
      location: "Sacramento, CA",
      category: "Animals",
      requiredVolunteers: 10,
    },
  ];

  const [tasks, setTasks] = useState(createdTasks);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for task ID: ${id} is not implemented yet.`);
  };

  const handleWithdraw = (id) => {
    alert(`Withdraw functionality for task ID: ${id} is not implemented yet.`);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setTasks(tab === "created" ? createdTasks : involvedTasks);
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">My Tasks</h1>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => switchTab("created")}
          className={`px-4 py-2 rounded-t-lg border-b-2 ${
            activeTab === "created"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-600"
          }`}
        >
          Tasks I Created
        </button>
        <button
          onClick={() => switchTab("involved")}
          className={`px-4 py-2 rounded-t-lg border-b-2 ${
            activeTab === "involved"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-600"
          }`}
        >
          Tasks I'm Involved In
        </button>
      </div>

      {/* Task Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Organization</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">
              Volunteers Needed
            </th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{task.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                {task.organization}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {task.location}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {task.category}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {task.requiredVolunteers}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {activeTab === "created" ? (
                  <>
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      <Pencil className="inline w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="inline w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleWithdraw(task.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Withdraw Application
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No tasks available.
        </div>
      )}
    </div>
  );
};

export default TaskTable;
