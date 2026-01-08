import { useParams, Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCase, useUpdateCase } from '../api';
import { useEffect } from 'react';

const caseSchema = z.object({
    startDate: z.string().min(1, 'Дата початку обов\'язкова'),
    endDate: z.string().min(1, 'Дата закінчення обов\'язкова'),
    status: z.boolean(),
}).refine((data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end >= start;
}, {
    message: 'Дата закінчення не може бути раніше дати початку',
    path: ['endDate'],
});

type CaseFormData = z.infer<typeof caseSchema>;

export function CaseDetailPage() {
    const { caseId } = useParams({ from: '/cases/$caseId' });
    const numericId = Number(caseId);

    const { data: caseItem, isLoading, isError } = useCase(numericId);
    const updateCaseMutation = useUpdateCase();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CaseFormData>({
        resolver: zodResolver(caseSchema),
    });

    useEffect(() => {
        if (caseItem) {
            reset({
                startDate: caseItem.startDate,
                endDate: caseItem.endDate,
                status: caseItem.status,
            });
        }
    }, [caseItem, reset]);

    const onSubmit = (data: CaseFormData) => {
        updateCaseMutation.mutate({ id: numericId, data });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Завантаження деталей справи...</div>
            </div>
        );
    }

    if (isError || !caseItem) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-600">Справу не знайдено.</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="mb-6">
                <Link to="/cases" className="text-blue-600 hover:text-blue-800">
                    ← Назад до списку справ
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6">Редагувати справу #{caseItem.id}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
                <div>
                    <label htmlFor="startDate" className="block font-medium mb-1">
                        Дата початку
                    </label>
                    <input
                        id="startDate"
                        type="date"
                        {...register('startDate')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.startDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="endDate" className="block font-medium mb-1">
                        Дата закінчення
                    </label>
                    <input
                        id="endDate"
                        type="date"
                        {...register('endDate')}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.endDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
                    )}
                </div>

                <div className="flex items-center">
                    <input
                        id="status"
                        type="checkbox"
                        {...register('status')}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="status" className="ml-2 block text-sm font-medium">
                        Справа закрита
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={updateCaseMutation.isPending}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition"
                >
                    {updateCaseMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
                </button>
            </form>
        </div>
    );
}