import { createFileRoute } from '@tanstack/react-router';
import { CaseDetailPage } from '@/features/cases/pages/CaseDetailPage';

export const Route = createFileRoute('/cases/$caseId')({
  component: CaseDetailPage,
});