"use client";

import { SignIn, useUser } from "@clerk/nextjs";

export default function Auth() {
  const { user } = useUser();

  if (!user)
    return (
      <div className="block m-auto w-fit mt-10">
        <SignIn routing="hash" forceRedirectUrl="/tasks/" />
      </div>
    );

  return <div>Welcome!</div>;
}
