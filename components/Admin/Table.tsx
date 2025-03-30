"use client";

import React, { useState, useMemo, act } from "react";
import { Pencil, Trash, BookText } from "lucide-react";
import useAPI from "@/api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ReactPaginate from "react-paginate";

export default function Table() {
  const {
    fetchTasksForAdmin,
    applyActionToUserByAdmin,
    applyActionToTaskByAdmin,
    fetchUsersForAdmin,
  } = useAPI();
  const [activeTab, setActiveTab] = useState("users");
  const [currentPage, setCurrentPage] = useState(0);
  const perPage = 25;
  const router = useRouter();

  const result = useQuery({
    queryKey: ["tasks-of-admin", currentPage, activeTab],
    queryFn: () =>
      activeTab == "tasks"
        ? fetchTasksForAdmin(currentPage + 1, perPage)
        : fetchUsersForAdmin(currentPage + 1, perPage),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handleUserAction = async (id: string, action: string) => {
    try {
      await applyActionToUserByAdmin(id, action);
      toast("Successfully performed " + action, { type: "success" });
      result.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to apply the action", { type: "error" });
    }
  };

  const handleTaskAction = async (id: string, action: string) => {
    try {
      await applyActionToTaskByAdmin(id, action);
      toast("Successfully performed " + action, { type: "success" });
      result.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to apply the action", { type: "error" });
    }
  };

  const handleEdit = (id) => {
    router.push(`/tasks/${id}/edit`);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); // ReactPaginate returns the selected page index
  };

  const pageCount = useMemo(() => {
    return result.data ? Math.ceil(result.data.count / perPage) : 0;
  }, [result.data?.count]);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Admin</h1>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => switchTab("users")}
          className={`px-4 py-2 rounded-t-lg border-b-2 ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-600"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => switchTab("tasks")}
          className={`px-4 py-2 rounded-t-lg border-b-2 ${
            activeTab === "tasks"
              ? "border-blue-600 text-blue-600"
              : "border-gray-300 text-gray-600"
          }`}
        >
          Tasks
        </button>
      </div>

      {activeTab == "tasks" && (
        <>
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
                      {task.blocked == true ? (
                        <button
                          onClick={() => handleTaskAction(task.id, "unblock")}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:green-red-700 transition"
                        >
                          Unblock Task
                        </button>
                      ) : (
                        <button
                          onClick={() => handleTaskAction(task.id, "block")}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        >
                          Block Task
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={`flex justify-center mt-8 space-x-2 ${
              result.isPending ? "hidden" : ""
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
        </>
      )}

      {activeTab == "users" && (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Email</th>
                <th className="border border-gray-300 px-4 py-2">First Name</th>
                <th className="border border-gray-300 px-4 py-2">Last Name</th>
                <th className="border border-gray-300 px-4 py-2">
                  Phonenumber
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {result.data &&
                result.data.records.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.first_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.last_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.phone_number}
                    </td>

                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {user.blocked == true ? (
                        <button
                          onClick={() => handleUserAction(user.id, "unblock")}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:green-red-700 transition"
                        >
                          Unblock User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, "block")}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                        >
                          Block User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={`flex justify-center mt-8 space-x-2 ${
              result.isPending ? "hidden" : ""
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
        </>
      )}
    </div>
  );
}
