import { createFileRoute } from '@tanstack/react-router';
import { CaseCreatePage } from '@/features/cases/pages/CaseCreatePage';

export const Route = createFileRoute('/cases/new')({
  component: CaseCreatePage,
});