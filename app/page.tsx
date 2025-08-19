import { SignedOut } from "@clerk/nextjs";

import Link from "next/link";

import Enter from "./register/register";
import Form from "@/components/upload/Input-form";
import HeroSection from "@/components/home/1st-part";

export default function Home() {
  return (
   <>
   <HeroSection/>
   {/* <Enter /> */}
   {/* <Form /> */}
   {/* <SignOutButton /> */}
   </>
  );
}
