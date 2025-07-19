import axios from "axios";

const api = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function getAll<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const { data } = await api.get<T>(endpoint, { params });
  return data;
}

export async function getById<T>(
  endpoint: string,
  id: number | string
): Promise<T> {
  const { data } = await api.get<T>(`${endpoint}/${id}`);
  return data;
}

export async function create<T>(
  endpoint: string,
  payload: Record<string, any>
): Promise<T> {
  const { data } = await api.post(endpoint, payload);
  return data;
}

export async function updateById<T>(
  endpoint: string,
  id: number | string,
  payload: Record<string, any>
): Promise<T> {
  const { data } = await api.put(`${endpoint}/${id}`, payload);
  return data;
}

export function deleteById(
  endpoint: string,
  id: number | string
): Promise<void> {
  return api.delete(`${endpoint}/${id}`);
}

export default api;
