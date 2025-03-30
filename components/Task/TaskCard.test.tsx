// @ts-nocheck

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { MapPin, Filter, Heart } from "lucide-react";

// Mock next/link with TypeScript support
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;

  MockLink.displayName = "MockLink";
  return MockLink;
});

// Mock react-toastify to prevent side effects
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Lucide icons to verify they're rendered
jest.mock("lucide-react", () => ({
  MapPin: jest.fn(() => <div data-testid="map-pin-icon" />),
  Filter: jest.fn(() => <div data-testid="filter-icon" />),
  Heart: jest.fn(() => <div data-testid="heart-icon" />),
  UserIcon: jest.fn(() => <div data-testid="user-icon" />),
}));

describe("TaskCard", () => {
  const mockHandleApply = jest.fn();
  const mockPost = {
    id: "1",
    title: "Help Local Food Bank",
    formatted_address: "San Francisco, CA",
    category: { name: "Food Security" },
    description:
      "Join us in helping sort and distribute food to those in need.",
    media: [{ link: "http:/example.com/image.jpg" }],
    subscribed_users: [
      { id: "1" },
      { id: "2" },
      { id: "3" },
      { id: "4" },
      { id: "5" },
    ],
    required_volunteers_count: 10,
    is_subscribed: false,
    user: {
      first_name: "test",
      last_name: "example",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all post information correctly", () => {
    render(<TaskCard opp={mockPost} handleApply={mockHandleApply} />);

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(screen.getByText(mockPost.formatted_address)).toBeInTheDocument();
    expect(screen.getByText(mockPost.category.name)).toBeInTheDocument();
    expect(screen.getByText(mockPost.description)).toBeInTheDocument();
    expect(screen.getByText("5/10 Volunteers")).toBeInTheDocument();
    expect(screen.getByText("Apply Now")).toBeInTheDocument();
  });

  it("renders the image when media is provided", () => {
    render(<TaskCard opp={mockPost} handleApply={mockHandleApply} />);

    const image = screen.getByAltText(mockPost.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "http:/example.com/image.jpg");
  });

  it("does not render image when media is empty", () => {
    const postWithoutImage = {
      ...mockPost,
      media: [],
    };
    render(<TaskCard opp={postWithoutImage} handleApply={mockHandleApply} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the correct link for the title", () => {
    render(<TaskCard opp={mockPost} handleApply={mockHandleApply} />);
    const link = screen.getByText(mockPost.title).closest("a");
    expect(link).toHaveAttribute("href", `/tasks/${mockPost.id}`);
  });

  it("renders the correct volunteer count", () => {
    const postWithDifferentCounts = {
      ...mockPost,
      subscribed_users: [{ id: "1" }, { id: "2" }, { id: "3" }],
      required_volunteers_count: 8,
    };
    render(
      <TaskCard opp={postWithDifferentCounts} handleApply={mockHandleApply} />
    );
    expect(screen.getByText("3/8 Volunteers")).toBeInTheDocument();
  });

  it("shows 'Already Applied' when is_subscribed is true", () => {
    const subscribedPost = {
      ...mockPost,
      is_subscribed: true,
    };
    render(<TaskCard opp={subscribedPost} handleApply={mockHandleApply} />);
    expect(screen.getByText("Already Applied")).toBeInTheDocument();
    expect(screen.queryByText("Apply Now")).not.toBeInTheDocument();
  });

  it("calls handleApply when Apply Now button is clicked", () => {
    render(<TaskCard opp={mockPost} handleApply={mockHandleApply} />);
    fireEvent.click(screen.getByText("Apply Now"));
    expect(mockHandleApply).toHaveBeenCalledWith(mockPost.id);
  });

  it("renders location and category icons", () => {
    render(<TaskCard opp={mockPost} handleApply={mockHandleApply} />);
    expect(screen.getByTestId("map-pin-icon")).toBeInTheDocument();
    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
    expect(screen.getByTestId("heart-icon")).toBeInTheDocument();
  });
});
