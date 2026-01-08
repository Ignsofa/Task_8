import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { useCreateCase } from "../api";

// ================== ZOD SCHEMA ==================

const caseSchema = z
	.object({
		startDate: z.string().min(1, "Дата початку обовʼязкова"),
		endDate: z.string().min(1, "Дата закінчення обовʼязкова"),
		requestText: z.string().min(5, "Мінімум 5 символів"),
		userId: z.number().positive("User ID має бути додатнім числом"),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end >= start;
		},
		{
			message: "Дата закінчення не може бути раніше дати початку",
			path: ["endDate"],
		}
	);

type CaseFormData = z.infer<typeof caseSchema>;

// ================== PAGE ==================

export function CaseCreatePage() {
	const createCaseMutation = useCreateCase();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CaseFormData>({
		resolver: zodResolver(caseSchema),
	});

	const onSubmit = (data: CaseFormData) => {
		createCaseMutation.mutate(data);
	};

	return (
		<div className="container mx-auto p-4 max-w-2xl">
			<div className="mb-6">
				<Link to="/cases" className="text-blue-600 hover:text-blue-800">
					← Назад до списку справ
				</Link>
			</div>

			<h1 className="text-3xl font-bold mb-6">Створити нову справу</h1>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="space-y-4 bg-white p-6 rounded shadow"
			>
				{/* USER ID */}
				<div>
					<label htmlFor="userId" className="block font-medium mb-1">
						ID користувача
					</label>
					<input
						id="userId"
						type="number"
						{...register("userId", { valueAsNumber: true })}
						className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.userId && (
						<p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>
					)}
				</div>

				{/* REQUEST TEXT */}
				<div>
					<label htmlFor="requestText" className="block font-medium mb-1">
						Опис звернення
					</label>
					<textarea
						id="requestText"
						{...register("requestText")}
						className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.requestText && (
						<p className="text-red-500 text-sm mt-1">
							{errors.requestText.message}
						</p>
					)}
				</div>

				{/* START DATE */}
				<div>
					<label htmlFor="startDate" className="block font-medium mb-1">
						Дата початку
					</label>
					<input
						id="startDate"
						type="date"
						{...register("startDate")}
						className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.startDate && (
						<p className="text-red-500 text-sm mt-1">
							{errors.startDate.message}
						</p>
					)}
				</div>

				{/* END DATE */}
				<div>
					<label htmlFor="endDate" className="block font-medium mb-1">
						Дата закінчення
					</label>
					<input
						id="endDate"
						type="date"
						{...register("endDate")}
						className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.endDate && (
						<p className="text-red-500 text-sm mt-1">
							{errors.endDate.message}
						</p>
					)}
				</div>

				{/* SUBMIT */}
				<button
					type="submit"
					disabled={createCaseMutation.isPending}
					className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 transition"
				>
					{createCaseMutation.isPending ? "Створення..." : "Створити справу"}
				</button>
			</form>
		</div>
	);
}
