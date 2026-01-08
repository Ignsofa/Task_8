import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import apiClient from "@/lib/axios";
import type { Case, CaseFormData } from "./types";

// ============ API FUNCTIONS ============

const getCases = async (): Promise<Case[]> => {
	const response = await apiClient.get("/cases");
	return response.data;
};

const getCaseById = async (id: number): Promise<Case> => {
	const response = await apiClient.get(`/cases/${id}`);
	return response.data;
};

// 🔴 ВАЖЛИВО: формуємо payload вручну
const createCase = async (data: CaseFormData): Promise<Case> => {
	const response = await apiClient.post("/cases", {
		userId: data.userId,
		requestText: data.requestText,
		startDate: data.startDate,
		endDate: data.endDate,
	});

	return response.data;
};

const updateCase = async ({
							  id,
							  data,
						  }: {
	id: number;
	data: Partial<CaseFormData>;
}): Promise<Case> => {
	const response = await apiClient.put(`/cases/${id}`, {
		startDate: data.startDate,
		endDate: data.endDate,
		requestText: data.requestText,
	});

	return response.data;
};

const deleteCase = async (id: number): Promise<void> => {
	await apiClient.delete(`/cases/${id}`);
};

// ============ REACT QUERY HOOKS ============

export const useCases = () =>
	useQuery<Case[]>({
		queryKey: ["cases"],
		queryFn: getCases,
	});

export const useCase = (id: number) =>
	useQuery<Case>({
		queryKey: ["cases", id],
		queryFn: () => getCaseById(id),
		enabled: Number.isInteger(id) && id > 0,
	});

export const useCreateCase = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: createCase,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
			navigate({ to: "/cases" });
		},
	});
};

export const useUpdateCase = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: updateCase,
		onSuccess: (updatedCase) => {
			queryClient.invalidateQueries({ queryKey: ["cases"] });
			queryClient.setQueryData(["cases", updatedCase.id], updatedCase);
			navigate({ to: "/cases" });
		},
	});
};

export const useDeleteCase = () =>
	useMutation({
		mutationFn: deleteCase,
		onSuccess: () => {
			const queryClient = useQueryClient();
			queryClient.invalidateQueries({ queryKey: ["cases"] });
		},
	});