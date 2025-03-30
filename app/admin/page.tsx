import React from "react";
import { auth } from "@clerk/nextjs/server";
import Table from "@/components/Admin/Table";

export default async function page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId, getToken } = await auth();

  const token = await getToken();
  let result = null;

  try {
    // Submit the form data to the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/admin/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!(response.status == 200)) {
      console.log(response.status);

      if (response.status == 403) {
        return <span>Forbidden</span>;
      }
    }

    result = await response.json();
  } catch (error) {
    console.error("failed to fetch tasks for admin:", error);
  }

  return (
    <div>
      <Table />
    </div>
  );
}
