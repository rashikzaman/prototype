// @ts-nocheck

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Table from "./Table";
import useAPI from "../../api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// Mock the modules
jest.mock("../../api/useAPI");
jest.mock("@tanstack/react-query");
jest.mock("next/navigation");
jest.mock("react-toastify");

// Mock implementations
const mockFetchTasksForAdmin = jest.fn();
const mockFetchUsersForAdmin = jest.fn();
const mockApplyActionToUserByAdmin = jest.fn();
const mockApplyActionToTaskByAdmin = jest.fn();

const mockUseAPI = useAPI as jest.MockedFunction<typeof useAPI>;
mockUseAPI.mockReturnValue({
  fetchTasksForAdmin: mockFetchTasksForAdmin,
  fetchUsersForAdmin: mockFetchUsersForAdmin,
  applyActionToUserByAdmin: mockApplyActionToUserByAdmin,
  applyActionToTaskByAdmin: mockApplyActionToTaskByAdmin,
});

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockPush = jest.fn();
mockUseRouter.mockReturnValue({
  push: mockPush,
});

describe("Table Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockUseQuery.mockReturnValue({
      data: null,
      isPending: false,
      refetch: jest.fn(),
    } as any);
  });

  it("renders the admin title and tabs", () => {
    render(<Table />);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Tasks")).toBeInTheDocument();
  });

  it("defaults to showing users tab", () => {
    render(<Table />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.queryByText("Title")).not.toBeInTheDocument();
  });

  it("switches to tasks tab when clicked", () => {
    render(<Table />);

    fireEvent.click(screen.getByText("Tasks"));

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.queryByText("Email")).not.toBeInTheDocument();
  });

  describe("Users Tab", () => {
    beforeEach(() => {
      mockUseQuery.mockReturnValue({
        data: {
          records: [
            {
              id: "1",
              email: "test@example.com",
              first_name: "John",
              last_name: "Doe",
              phone_number: "1234567890",
              blocked: false,
            },
            {
              id: "2",
              email: "blocked@example.com",
              first_name: "Jane",
              last_name: "Smith",
              phone_number: "0987654321",
              blocked: true,
            },
          ],
          count: 2,
        },
        isPending: false,
        refetch: jest.fn(),
      } as any);
    });

    it("displays user data correctly", () => {
      render(<Table />);

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Doe")).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();

      expect(screen.getByText("blocked@example.com")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("Smith")).toBeInTheDocument();
      expect(screen.getByText("0987654321")).toBeInTheDocument();
    });

    it("shows block button for unblocked users", () => {
      render(<Table />);

      expect(screen.getAllByText("Block User").length).toBe(1);
    });

    it("shows unblock button for blocked users", () => {
      render(<Table />);

      expect(screen.getAllByText("Unblock User").length).toBe(1);
    });

    it("calls handleUserAction when block button is clicked", async () => {
      render(<Table />);

      fireEvent.click(screen.getByText("Block User"));

      await waitFor(() => {
        expect(mockApplyActionToUserByAdmin).toHaveBeenCalledWith("1", "block");
      });
    });
  });

  describe("Tasks Tab", () => {
    beforeEach(() => {
      mockUseQuery.mockReturnValue({
        data: {
          records: [
            {
              id: "1",
              title: "Community Cleanup",
              formatted_address: "123 Main St",
              category: { name: "Environment" },
              required_volunteers_count: 10,
              subscribed_users: [],
              blocked: false,
            },
            {
              id: "2",
              title: "Food Drive",
              formatted_address: "456 Oak Ave",
              category: { name: "Food Security" },
              required_volunteers_count: 5,
              subscribed_users: [{}, {}], // 2 volunteers
              blocked: true,
            },
          ],
          count: 2,
        },
        isPending: false,
        refetch: jest.fn(),
      } as any);
    });

    it("displays task data correctly", () => {
      render(<Table />);
      fireEvent.click(screen.getByText("Tasks"));

      expect(screen.getByText("Community Cleanup")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();
      expect(screen.getByText("Environment")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();

      expect(screen.getByText("Food Drive")).toBeInTheDocument();
      expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
      expect(screen.getByText("Food Security")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows block button for unblocked tasks", () => {
      render(<Table />);
      fireEvent.click(screen.getByText("Tasks"));

      expect(screen.getAllByText("Block Task").length).toBe(1);
    });

    it("shows unblock button for blocked tasks", () => {
      render(<Table />);
      fireEvent.click(screen.getByText("Tasks"));

      expect(screen.getAllByText("Unblock Task").length).toBe(1);
    });

    it("calls handleTaskAction when block button is clicked", async () => {
      render(<Table />);
      fireEvent.click(screen.getByText("Tasks"));

      fireEvent.click(screen.getByText("Block Task"));

      await waitFor(() => {
        expect(mockApplyActionToTaskByAdmin).toHaveBeenCalledWith("1", "block");
      });
    });
  });

  it("handles pagination correctly", () => {
    mockUseQuery.mockReturnValue({
      data: {
        records: [],
        count: 100, // More than one page
      },
      isPending: false,
      refetch: jest.fn(),
    } as any);

    render(<Table />);

    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
