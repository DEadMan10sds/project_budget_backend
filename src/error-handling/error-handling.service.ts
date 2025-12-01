import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';

@Injectable()
export class ErrorHandlingService {
  handleError(error: any): never {
    // Errores de base de datos (PostgreSQL)
    switch (error.code) {
      case '23505':
      case '23502':
        throw new BadRequestException(error.detail);
    }

    if (isAxiosError(error) && error.config?.url?.includes('api.crol')) {
      const statusCode = error.response?.status;
      const data = error.response?.data;

      switch (statusCode) {
        case 400:
          throw new BadRequestException(error.response?.data);
        case 401:
          console.log(error.response);
          throw new UnauthorizedException('Unauthorized in crol');
        case 404:
          throw new NotFoundException('CROL endpoint not found');
        default:
          throw new BadRequestException(data || 'Unknown error from CROL');
      }
    }

    console.error('********* Unhandled error:', error);
    throw new BadRequestException(error.message);
  }
}
