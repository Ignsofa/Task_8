import { Link } from '@tanstack/react-router';
import { useCases, useDeleteCase } from '../api';

export function CasesListPage() {
    const { data: cases, isLoading, isError, error } = useCases();
    const deleteCaseMutation = useDeleteCase();

    const handleDelete = (id: number) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю справу?')) {
            deleteCaseMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Завантаження...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-600">
                    Помилка завантаження: {error.message}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Справи детектива</h1>
                <Link
                    to="/cases/new"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Створити нову справу
                </Link>
            </div>

            <div className="bg-white shadow-md rounded overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold">ID</th>
                        <th className="py-3 px-4 text-left font-semibold">Дата початку</th>
                        <th className="py-3 px-4 text-left font-semibold">Дата закінчення</th>
                        <th className="py-3 px-4 text-left font-semibold">Статус</th>
                        <th className="py-3 px-4 text-center font-semibold">Дії</th>
                    </tr>
                    </thead>

                    <tbody>
                    {cases?.map((caseItem) => (
                        <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{caseItem.id}</td>
                            <td className="py-3 px-4">{caseItem.startDate}</td>
                            <td className="py-3 px-4">{caseItem.endDate}</td>
                            <td className="py-3 px-4">
                  <span
                      className={`px-2 py-1 rounded text-xs ${
                          caseItem.status
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {caseItem.status ? 'Закрита' : 'Відкрита'}
                  </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                                <Link
                                    to="/cases/$caseId"
                                    params={{ caseId: String(caseItem.id) }}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                    Редагувати
                                </Link>
                                <button
                                    onClick={() => handleDelete(caseItem.id)}
                                    disabled={deleteCaseMutation.isPending}
                                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                >
                                    {deleteCaseMutation.isPending ? 'Видалення...' : 'Видалити'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {cases?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Немає справ. Створіть першу справу!
                    </div>
                )}
            </div>
        </div>
    );
}