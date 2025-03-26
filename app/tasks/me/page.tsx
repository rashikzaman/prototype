"use client";

import React, { useState } from "react";
import { Pencil, Trash, BookText } from "lucide-react";
import useAPI from "@/api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const TaskTable = () => {
  const {
    fetchTasksCreatedByUser,
    fetchTasksSubscribedByUser,
    deleteTask,
    withdrawFromTask,
  } = useAPI();
  const [activeTab, setActiveTab] = useState("created");
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 50;
  const router = useRouter();

  const result = useQuery({
    queryKey: ["tasks-of-me", currentPage, activeTab],
    queryFn: () =>
      activeTab == "created"
        ? fetchTasksCreatedByUser(currentPage + 1, perPage)
        : fetchTasksSubscribedByUser(currentPage + 1, perPage),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast("Successfully deleted the task", { type: "success" });
      result.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to delete the task", { type: "error" });
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await withdrawFromTask(id);
      toast("Withdraw application successfully", { type: "success" });
      result.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to withdraw", { type: "error" });
    }
  };

  const handleEdit = (id) => {
    router.push(`/tasks/${id}/edit`);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
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
            <th className="border border-gray-300 px-4 py-2">Location</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">
              Volunteers Needed
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Volunteers Applied
            </th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {result.data &&
            result.data.records.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {task.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.formatted_address}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.category.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.required_volunteers_count}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {task.subscribed_users ? task.subscribed_users.length : 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {activeTab === "created" ? (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/tasks/${task.id}/application`)
                        }
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        <BookText className="inline w-5 h-5" />
                      </button>
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
    </div>
  );
};

export default TaskTable;
