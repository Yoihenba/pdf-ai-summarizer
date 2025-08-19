import { getDbConnection } from './db';

export type Summary = {
  id: string;
  ufsUrl: string;
  title: string | null;
  created_at: string;
  summary_text: string;
  status: string;
};

export async function getSummaries(userId: string): Promise<Summary[]> {
  const sql = await getDbConnection();
  const summaries = await sql`
    SELECT id, original_file_url, title, created_at, summary_text, status
    FROM pdf_summaries
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return summaries.map((row: any) => ({
    id: row.id,
    ufsUrl: row.original_file_url,
    title: row.title,
    created_at: row.created_at,
    summary_text: row.summary_text,
    status: row.status,
  }));
}

export type SummaryWithDetails = Summary & {
  file_name: string;
  word_count: number;
};

export async function getSummaryById(id: string): Promise<SummaryWithDetails | null> {
  try {
    const sql = await getDbConnection();
    const [summary] = await sql`
      SELECT
        id,
        user_id,
        title,
        original_file_url,
        summary_text,
        status,
        created_at,
        updated_at,
        file_name,
        LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
      FROM
        pdf_summaries
      WHERE
        id = ${id}
    `;
    if (!summary) return null;
    return {
      id: summary.id,
      ufsUrl: summary.original_file_url,
      title: summary.title,
      created_at: summary.created_at,
      summary_text: summary.summary_text,
      status: summary.status,
      file_name: summary.file_name,
      word_count: summary.word_count,
    };
  } catch (err) {
    console.error('Error fetching summary by id', err);
    return null;
  }
}
