import React from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar({ user }) {
  return (
    <nav className="bg-blue-600 text-white w-full p-4" data-testid="navbar">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/tasks" data-testid="brand-link">
            ACT Local
          </Link>
        </div>
        <div
          className="space-x-6 hidden md:flex"
          data-testid="nav-links-container"
        >
          <SignedIn data-testid="nav-links-signedin">
            <a
              href="/tasks"
              className="hover:text-gray-200"
              data-testid="nav-home"
            >
              Home
            </a>
            <a
              href="/tasks/me"
              className="hover:text-gray-200"
              data-testid="nav-my-tasks"
            >
              My Tasks
            </a>
            <a
              href="/profile/me"
              className="hover:text-gray-200"
              data-testid="nav-profile"
            >
              Profile
            </a>
            {user.role == "admin" && (
              <a
                href="/admin"
                className="hover:text-gray-200"
                data-testid="nav-admin"
              >
                Admin
              </a>
            )}
          </SignedIn>
        </div>
        {/* Profile Icon */}
        <div className="relative" data-testid="user-section">
          <SignedOut data-testid="signed-out">
            <SignInButton />
          </SignedOut>
          <SignedIn data-testid="user-signedin">
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
