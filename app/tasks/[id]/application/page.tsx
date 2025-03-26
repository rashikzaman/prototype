"use client";

import React, { useState } from "react";
import { Pencil, Trash, BookText } from "lucide-react";
import useAPI from "@/api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";

const TaskApplication = () => {
  const { deleteTask, withdrawFromTask, fetchSubscriberOfTask } = useAPI();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const result = useQuery({
    queryKey: ["fetch-subscribers-of-task"],
    queryFn: () => fetchSubscriberOfTask(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const handleDelete = async (id: any) => {
    try {
      await deleteTask(id);
      toast("Successfully deleted the task", { type: "success" });
      result.refetch();
    } catch (e) {
      console.error(e);
      toast("Failed to delete the task", { type: "error" });
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Tasks Applications
      </h1>

      {/* Task Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {result.data &&
            result.data.map((userTask) => (
              <tr key={userTask.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {userTask.user.first_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userTask.user.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userTask.user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {userTask.user.phone_number}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {/* {activeTab === "created" ? (
                    <>
                      <button
                        onClick={() => handleEdit(userTask.id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        <BookText className="inline w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(userTask.id)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Pencil className="inline w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(userTask.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="inline w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleWithdraw(userTask.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                    >
                      Withdraw Application
                    </button>
                  )} */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskApplication;
