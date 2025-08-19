'use client';

import { FileText } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      {/* Logo and Home Link */}
      <div className="flex lg:flex-1">
        <Link href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">pdf</span>
        </Link>
      </div>

      {/* Center Nav Links */}
      <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        {/* <Link href="/#pricing" className="text-gray-600 hover:text-rose-500 transition-colors duration-200">
          Pricing
        </Link> */}
        <SignedIn>
          <Link href="/dashboard" className="text-gray-800 hover:text-yellow-500 ">
            your summaries
          </Link>
        </SignedIn>
      </div>

      {/* Right Side Auth Buttons */}
      <div className="flex lg:justify-end lg:flex-1">
        <SignedIn>
          <div className="flex gap-2 items-center">
            <Link href="/upload" className="text-gray-800 hover:text-yellow-500 ">
              upload a pdf
            </Link>
            {/* <div>Pro</div> */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex gap-2 items-center">
            <Link href="/sign-in" className="text-gray-600 hover:text-yellow-500 transition-colors duration-200">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/sign-up" className="text-gray-600 hover:text-yellow-500 transition-colors duration-200">Sign Up</Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}
