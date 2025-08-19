import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function register(){
    return (
    <SignedOut>
  <div className="flex gap-2 items-center">
    <Link href="/sign-in" className="text-blue-600">
      Sign In
    </Link>
    <Link
      href="/sign-up"
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign Up
    </Link>
  </div>
</SignedOut>
  );
}