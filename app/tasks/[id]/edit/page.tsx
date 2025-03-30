"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUploadWithPreview } from "file-upload-with-preview";
import "file-upload-with-preview/dist/style.css";
import useAPI from "@/api/useAPI";
import { useQueries } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import TaskForm from "@/components/Task/TaskForm";

const EditVolunteerTask = () => {
  const { updateTask, fetchTask, fetchCategories } = useAPI();
  const upload = useRef(null);
  const params = useParams();

  const results = useQueries({
    queries: [
      {
        queryKey: ["categories"],
        queryFn: () => fetchCategories(),
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      {
        queryKey: ["fetch-task-edit"],
        queryFn: () => fetchTask(params.id),
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    ],
  });

  const [categoriesQuery, taskQuery] = results;

  useEffect(() => {
    if (!upload.current) {
      upload.current = new FileUploadWithPreview("my-unique-id", {
        multiple: true,
        maxFileCount: 3,
      });
    }
  }, []);

  useEffect(() => {
    if (taskQuery.data) {
      setFormData({
        title: taskQuery.data.title || "",
        latitude: taskQuery.data.latitude?.toString() || "",
        longitude: taskQuery.data.longitude?.toString() || "",
        formatted_address: taskQuery.data.formatted_address || "",
        category: taskQuery.data.category_id || "",
        description: taskQuery.data.description || "",
        required_volunteers_count:
          taskQuery.data.required_volunteers_count || 0,
        required_skills: Array.isArray(taskQuery.data.required_skills)
          ? taskQuery.data.required_skills.join(",")
          : "",
      });
    }
  }, [taskQuery.data]);

  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    formatted_address: "",
    category: "",
    description: "",
    required_volunteers_count: 0,
    required_skills: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocation = (place: any) => {
    if (place && place.formatted_address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        formatted_address: place.formatted_address,
        latitude: place.geometry?.location.lat(),
        longitude: place.geometry?.location.lng(),
      }));
    }
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    formData.category_id = formData.category;
    formData.required_skills = formData.required_skills.split(",");
    formData.required_volunteers_count = Number(
      formData.required_volunteers_count
    );

    delete formData.category;

    formData.latitude = Number(formData.latitude);
    formData.longitude = Number(formData.longitude);

    try {
      await updateTask(params.id, formData);
      toast("Task updated successfully", { type: "success" });
    } catch (e) {
      toast("Failed to update the task, please try again later!", {
        type: "error",
      });
    }
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
        <TaskForm
          formData={formData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          categories={categoriesQuery.data ? categoriesQuery.data : []}
          handleLocation={handleLocation}
          handleCategoryChange={handleCategoryChange}
          type="update"
        />
      )}
    </div>
  );
};

export default EditVolunteerTask;
