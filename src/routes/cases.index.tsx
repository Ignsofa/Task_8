import { createFileRoute } from '@tanstack/react-router';
import { CasesListPage } from '@/features/cases/pages/CasesListPage';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const Route = createFileRoute('/cases/')({
    component: CasesListPage,
});