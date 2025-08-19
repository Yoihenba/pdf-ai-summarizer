// summary-card.tsx

import { Card } from '@/components/ui/card';
import DeleteButton from '@/components/summaries/delete-button';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { cn, formatFileName } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type SummaryProps = {
  summary: {
    id: string;
    ufsUrl: string;
    title: string | null;
    created_at: string;
    summary_text: string;
    status: string;
  }
};

const SummaryHeader = ({
  ufsUrl,
  title,
  createdAt,
}: {
  ufsUrl: string;
  title: string | null;
  createdAt: string;
}) => (
  <div className="flex items-start gap-2 sm:gap-4">
    <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-black/90 mt-1" />
    <div className="flex-1 min-w-0">
      <h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-4/5">
        {title || formatFileName(ufsUrl)}
      </h3>
      <p className="text-sm text-gray-500">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </p>
    </div>
  </div>
);

// const StatusBadge = ({ status }: { status: string }) => (
//   <span
//     className={cn(
//       'px-3 py-1 text-xs font-medium rounded-full capitalize',
//       status === 'completed'
//         ? 'bg-green-100 text-green-800'
//         : 'bg-yellow-100 text-yellow-800'
//     )}
//   >
//     {status}
//   </span>
// );

export default function SummaryCard({ summary }: SummaryProps) {
  return (
    <div>
      <Card className="relative h-full">
        <div className="absolute top-2 right-2">
          <DeleteButton summaryId={summary.id} />
        </div>
        <Link href={`/summaries/${summary.id}`}>
          <div className="block p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <SummaryHeader
                ufsUrl={summary.ufsUrl}
                title={summary.title}
                createdAt={summary.created_at}
              />
              <p className="text-gray-600 line-clamp-2 text-sm sm:text-base pl-2">
                {summary.summary_text}
              </p>
              <div className="flex justify-between items-center mt-2 sm:mt-4">
                {/* <StatusBadge status={summary.status} /> */}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}
