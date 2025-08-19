import EmptySummaryState from '@/components/summaries/empty-summary-state';
import SummaryCard from '@/components/summaries/summary-card';
import { Button } from '@/components/ui/button';
import { getSummaries } from '@/lib/summaries';

import { currentUser } from '@clerk/nextjs/server';
import { Plus } from 'lucide-react';    
import Link from 'next/link';
import { redirect } from 'next/navigation';
  

export default async function DashboardPage() {
    const user = await currentUser();
    const userId = user?.id;
    if(!userId){
        return redirect('/sign-in');
    }
    const uploadLimit=5;
    const summaries = await getSummaries(userId);
  return (
    <main className="min-h-screen">
      
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-gray-600 to-gray-900 bg-clip-text text-transparent">
                Your Summaries
              </h1>
              
            </div>
            <Button
              variant={'link'}
              className="bg-black/90 hover:bg-black/80 hover:cursor-pointer text-white px-4 py-2 rounded"            >
              <Link href="/upload" className="flex items-center text-white hover:text-yellow-500">
                <Plus className="w-5 h-5 mr-2" />
                New Summary
              </Link>
            </Button>
          </div>
          {summaries.length===0 ? (
            <EmptySummaryState/>
          ):(
          <div className='grid grid-cols-1 gap-4 sm:gap-6
          md:grid-cols-2 lg:grid-cols-3 sm:px-0'>
            {summaries.map((summary,index)=>(
                <SummaryCard key={index} summary={summary} />
            ))}

          </div>
          )}
        </div>
      </div>
    </main>
  );
}
