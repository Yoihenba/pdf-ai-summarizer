import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DownloadSummaryButton } from '@/components/summaries/download-summary-button';

export function SourceInfo({
  fileName,
  ufsUrl,
  title,
  summaryText,
  createdAt,
}: {
  fileName: string;
  ufsUrl: string;
  title: string;
  summaryText: string;
  createdAt: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <FileText className="h-4 w-4 text-black/90" />
        <span>Source: {fileName}</span>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-3 text-black/90 hover:text-black/80 hover:bg-black/5"
          asChild
        >
          <a
            href={ufsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Original
          </a>
        </Button>
        <DownloadSummaryButton
          title={title}
          summaryText={summaryText}
          fileName={fileName}
          createdAt={createdAt}
        />
      </div>
    </div>
  );
}
 