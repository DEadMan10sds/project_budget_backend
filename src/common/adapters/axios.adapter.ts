import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import axios, { AxiosInstance } from 'axios';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  constructor(private readonly errorHandler: ErrorHandlingService) {}

  async get<T>(url: string, params: any): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url, params);
      return data;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async post<T>(url: string, body: any, config: any): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(url, body, config);
      return data;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }
}
