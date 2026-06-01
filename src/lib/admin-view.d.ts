export function filterAndPaginateLeads<T>(
  leads: T[],
  options: { status?: string; search?: string; page?: number; pageSize?: number }
): { items: T[]; total: number; page: number; totalPages: number }
