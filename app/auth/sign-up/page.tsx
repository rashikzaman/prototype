"use client";

import { SignIn, SignUp, useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  if (!user)
    return (
      <div className="block m-auto w-fit mt-10">
        <SignUp routing="hash" forceRedirectUrl="/tasks/" />
      </div>
    );

  return <div>Welcome!</div>;
}
