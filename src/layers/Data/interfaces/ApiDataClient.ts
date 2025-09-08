export interface ApiDataClient {
  get<T, P>(url: string, params?: P): Promise<T>;
  post<T, P>(url: string, data: P): Promise<T>;
  put<T, P>(url: string, data: P): Promise<T>;
  delete<T>(url: string): Promise<T>;
}
