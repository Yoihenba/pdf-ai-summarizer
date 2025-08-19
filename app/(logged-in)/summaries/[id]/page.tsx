
import { SourceInfo } from '@/components/summaries/source-info';
import { SummaryHeader } from '@/components/summaries/summary-header';
import { SummaryViewer } from '@/components/summaries/summary-viewer';
import { getSummaryById } from '@/lib/summaries';
import { notFound } from 'next/navigation';

export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Defensive: check for undefined or invalid id
  if (!id || id === 'undefined') {
    notFound();
  }

  const summary = await getSummaryById(id);
  if (!summary) {
    notFound();
  }

  const { title, summary_text, file_name, created_at, ufsUrl } = summary;

return (
  <div className="relative isolate min-h-screen bg-linear-to-b from-rose-50/40 to-white">
    
    <div className="container mx-auto flex flex-col gap-4">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-24">
        <div className="flex flex-col">
          <SummaryHeader title={title || 'Untitled'} createdAt={created_at} readingTime={0}/>
        </div>
        {file_name && (
        <SourceInfo
        title={title || 'Untitled'}
        summaryText={summary_text}
        fileName={file_name}
        createdAt={created_at}
        ufsUrl={ufsUrl}
        />
        )}
        <div className="relative mt-4 sm:mt-8 lg:mt-16">
  <div className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
    
    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />
    
   
    
    <div className="relative mt-8 sm:mt-6 flex justify-center">
     <SummaryViewer summary={summary.summary_text} />
    </div>
  </div>
</div>

      </div>
    </div> 
  </div>
);


  
}
