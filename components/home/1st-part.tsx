
import { Button } from "../ui/button"

import Link from 'next/link'

export default function HeroSection() {
    return (
    <section className="relative mx-auto flex flex-col 2-0 items-center justify-center
    py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl">
      
        
        <h1 className='font-bold text-4xl py-6 text-center'>Summarize any PDF with AI</h1>
        <h2 className='text-lg sm:text-xl lg:text-2xl text-center px-4
        lg:px-0 lg:max-w-4xl text-gray-600'>Get a summary of any document in seconds
        </h2>
        <div>
        <Button 
        className='text-white  hover:text-yellow-500 mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8
        sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16 bg-black/90 hover:bg-black/80 hover:cursor-pointer'>
            <Link href='/upload' className='flex gap-2 items-center'>
            <span>Get Started</span>
            </Link>
        </Button>
        </div>
      
    </section>
    );
}