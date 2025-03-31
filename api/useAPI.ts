import { useAuth } from "@clerk/nextjs";

export interface queryParam {
    category_ids: string[];
    skills: string[];
    latitude: string;
    longitude: string;
    is_subscribed: boolean;
    search_term: string;
    distance: number;
}

export default function useAPI() {
    const { getToken } = useAuth();

    const fetchCategories = async () => {
        try {
            const token = await getToken();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/categories/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const createTask = async (data: any) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...data,
                    }),
                },
            );

            if (!(response.status == 201)) {
                throw new Error("Failed to create volunteer task");
            }
        } catch (error) {
            console.error("Error creating volunteer task:", error);
            throw new Error("Failed to create volunteer task");
        }
    };

    const updateTask = async (id: Number, data: any) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...data,
                    }),
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to update volunteer task");
            }
        } catch (error) {
            console.error("Error creating update task:", error);
            throw new Error("Failed to update volunteer task");
        }
    };

    const fetchTasks = async (
        page: Number = 1,
        perPage: Number = 10,
        queryParam: queryParam,
    ) => {
        try {
            const token = await getToken();
            let url =
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/?page=${page}&per_page=${perPage}`;

            if (queryParam.category_ids.length > 0) {
                url = url + "&category_ids=" +
                    queryParam.category_ids.join(",");
            }

            if (queryParam.skills.length > 0) {
                url = url + "&skills=" + queryParam.skills.join(",");
            }

            if (queryParam.latitude && queryParam.longitude) {
                url = url + "&latitude=" + queryParam.latitude + "&longitude=" +
                    queryParam.longitude;
            }

            if (queryParam.is_subscribed != undefined) {
                url = url + "&is_subscribed=true";
            }

            if (queryParam.search_term != "") {
                url = url + "&search_term=" + queryParam.search_term;
            }

            if (queryParam.distance) {
                url = url + "&distance=" + queryParam.distance;
            }

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const applyToTask = async (taskID: string) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskID}/apply`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 201)) {
                throw new Error("Failed to apply to task");
            }
        } catch (error) {
            console.error("Failed to apply to task:", error);
            throw new Error("Failed to apply to task");
        }
    };

    const withdrawFromTask = async (taskID: string) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskID}/withdraw`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to withdraw from task");
            }
        } catch (error) {
            console.error("Failed to withdraw task:", error);
            throw new Error("Failed to withdraw to task");
        }
    };

    const fetchSkills = async () => {
        try {
            const token = await getToken();

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/skills/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const fetchTasksCreatedByUser = async (
        page: Number = 1,
        perPage: Number = 10,
    ) => {
        try {
            const token = await getToken();
            let url =
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/me?page=${page}&per_page=${perPage}`;

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const fetchTasksSubscribedByUser = async (
        page: Number = 1,
        perPage: Number = 10,
    ) => {
        try {
            const token = await getToken();
            let url =
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/me/subscribed?page=${page}&per_page=${perPage}`;

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const deleteTask = async (taskID: number) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskID}/`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to delete task");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
            throw new Error("Failed to delete task");
        }
    };

    const fetchTask = async (taskID: number) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskID}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to delete task");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Failed to delete task:", error);
            throw new Error("Failed to delete task");
        }
    };

    const fetchSubscriberOfTask = async (taskID: any) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/tasks/${taskID}/subscribers`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to delete task");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Failed to delete task:", error);
            throw new Error("Failed to delete task");
        }
    };

    const fetchTasksForAdmin = async (
        page: Number = 1,
        perPage: Number = 10,
    ) => {
        try {
            const token = await getToken();
            let url =
                `${process.env.NEXT_PUBLIC_API_HOST}/admin/tasks?page=${page}&per_page=${perPage}`;

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const fetchUsersForAdmin = async (
        page: Number = 1,
        perPage: Number = 10,
    ) => {
        try {
            const token = await getToken();
            let url =
                `${process.env.NEXT_PUBLIC_API_HOST}/admin/users?page=${page}&per_page=${perPage}`;

            const response = await fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            return result;
        } catch (error) {
            // Handle errors
            console.error("Error creating volunteer task:", error);
            return null;
        }
    };

    const applyActionToUserByAdmin = async (userID: string, action: string) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/admin/users/${userID}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to apply action to the user");
            }
        } catch (error) {
            console.error("Failed to apply action to the user:", error);
            throw new Error("Failed to apply action to the user");
        }
    };

    const applyActionToTaskByAdmin = async (taskID: string, action: string) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/admin/tasks/${taskID}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to apply action to the task");
            }
        } catch (error) {
            console.error("Failed to apply action to the task:", error);
            throw new Error("Failed to apply action to the task");
        }
    };

    const updateProfile = async (data: any) => {
        const token = await getToken();

        try {
            // Submit the form data to the API
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/users/me`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...data,
                    }),
                },
            );

            if (!(response.status == 200)) {
                throw new Error("Failed to create volunteer task");
            }

            return response;
        } catch (error) {
            console.error("Error creating volunteer task:", error);
            throw new Error("Failed to create volunteer task");
        }
    };

    return {
        fetchCategories,
        createTask,
        updateTask,
        fetchTasks,
        deleteTask,
        fetchTask,
        fetchSkills,
        applyToTask,
        withdrawFromTask,
        fetchTasksCreatedByUser,
        fetchTasksSubscribedByUser,
        fetchSubscriberOfTask,
        fetchTasksForAdmin,
        fetchUsersForAdmin,
        applyActionToUserByAdmin,
        applyActionToTaskByAdmin,
        updateProfile,
    };
}
