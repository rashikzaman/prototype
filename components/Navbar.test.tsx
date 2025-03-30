import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock Next.js Link
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

// Mock Clerk components
jest.mock("@clerk/nextjs", () => ({
  SignInButton: () => <button data-testid="sign-in-button">Sign In</button>,
  SignedIn: ({ children }) => (
    <div data-testid="signed-in-content">{children}</div>
  ),
  SignedOut: ({ children }) => (
    <div data-testid="signed-out-content">{children}</div>
  ),
  UserButton: () => <button data-testid="user-button">UserButton</button>,
}));

describe("Navbar", () => {
  it("renders the brand link correctly", () => {
    render(<Navbar user={{ role: null }} />);
    const brandLink = screen.getByTestId("brand-link");
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/tasks");
    expect(brandLink).toHaveTextContent("ACT Local");
  });

  it("displays navigation container with correct classes", () => {
    render(<Navbar user={{ role: null }} />);
    const navContainer = screen.getByTestId("nav-links-container");
    expect(navContainer).toHaveClass("hidden");
    expect(navContainer).toHaveClass("md:flex");
  });

  it("renders sign-in button and user button", () => {
    render(<Navbar user={{ role: null }} />);
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("renders home, tasks and profile links for regular users", () => {
    render(<Navbar user={{ role: "user" }} />);
    expect(screen.getByTestId("nav-home")).toBeInTheDocument();
    expect(screen.getByTestId("nav-my-tasks")).toBeInTheDocument();
    expect(screen.getByTestId("nav-profile")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-admin")).not.toBeInTheDocument();
  });

  it("renders admin link only for admin users", () => {
    // Test without admin role
    render(<Navbar user={{ role: "user" }} />);
    expect(screen.queryByTestId("nav-admin")).not.toBeInTheDocument();

    // Cleanup and test with admin role
    cleanup();
    render(<Navbar user={{ role: "admin" }} />);
    expect(screen.getByTestId("nav-admin")).toBeInTheDocument();
  });
});
