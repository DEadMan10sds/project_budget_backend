export interface HttpAdapter {
  get<T>(url: string, params: any): Promise<T>;
}
