import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { TokenResponse } from './interfaces/crol-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CrolToken } from './entities/crol-api.entity';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { CronJob } from 'cron';
import { CreateCrolProyect } from './dto/createCrolProyect.dto';
import { CrolProyectResponse } from './interfaces/crol-proyect-response.interface';
import { CreateCrolResourceDto } from './dto/createCrolResource.dto';
import { UpdateCrolProyectDto } from './dto/UpdateCrolProyect.dto';

@Injectable()
export class CrolApiService {
  constructor(
    @InjectRepository(CrolToken)
    private readonly crolTokenRepository: Repository<CrolToken>,
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
    private readonly errorHandler: ErrorHandlingService,
  ) {
    //void this.updateOnDb();
    new CronJob(
      '0 0 */2 * * *',
      () => {
        //void this.updateOnDb();
      },
      null,
      true,
    );
  }

  async getFromDb() {
    const token: CrolToken | null = await this.crolTokenRepository.findOneBy(
      {},
    );

    if (!token) return this.saveOnDb();

    return token;
  }

  async saveOnDb() {
    try {
      const token = await this.fetchCrolToken();

      const newToken = this.crolTokenRepository.create(token);
      await this.crolTokenRepository.save(newToken);

      return newToken;
    } catch (error) {
      console.log(error);
      this.errorHandler.handleError(error);
    }
  }

  async updateOnDb() {
    try {
      let tokenToUpdate = await this.getFromDb();
      const newToken = await this.fetchCrolToken();

      tokenToUpdate = { ...tokenToUpdate, ...newToken } as CrolToken;

      await this.crolTokenRepository.save(tokenToUpdate);
      return this.getFromDb();
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async fetchCrolToken() {
    const body = {
      apikey: this.configService.get('CROL_KEY') as string,
    };

    const crolToken = await this.http.post<TokenResponse>(
      `${this.configService.get('HOST_CROL')}/Auth`,
      body,
      {},
    );

    return crolToken;
  }

  async create(url: string, body: any) {
    const crolToken = `Bearer ${(await this.getFromDb())?.token}`;

    const created = await this.http.post<CrolProyectResponse>(url, body, {
      headers: {
        Authorization: crolToken,
        'Content-Type': 'application/json',
      },
    });

    return created;
  }

  async createProyect(crolData: CreateCrolProyect | UpdateCrolProyectDto) {
    const divisionId = crolData.divisionId ? crolData.divisionId : -1;

    const createdProyect: CrolProyectResponse = await this.create(
      `${this.configService.get('HOST_CROL')}/Proyectos`,
      { ...crolData, divisionId },
    );

    if (!createdProyect.data) {
      console.log(createdProyect);
      throw new BadRequestException(createdProyect.error.error.Message);
    }

    return createdProyect.data;
  }

  async createResource(resourceData: CreateCrolResourceDto) {
    return await this.create(
      `${this.configService.get('HOST_CROL')}/Productos/ProductoAgregar`,
      resourceData,
    );
  }

  async getFromCrol(url: string, queryParam: string) {
    const crolToken = `Bearer ${(await this.getFromDb())?.token}`;

    const result = await this.http.get(
      `${this.configService.get('HOST_CROL')}${url}?busqueda=${queryParam}`,
      {
        headers: {
          Authorization: crolToken,
        },
      },
    );
    return result;
  }

  async getServiceGroup() {
    const crolToken = `Bearer ${(await this.getFromDb())?.token}`;

    const satKeys = await this.http.get(
      `${this.configService.get('HOST_CROL')}/Productos/Agrupadores`,
      {
        headers: {
          Authorization: crolToken,
        },
      },
    );
    return satKeys;
  }

  async getSatKeys(queryParam: string) {
    const crolToken = `Bearer ${(await this.getFromDb())?.token}`;

    const satKeys = await this.http.get(
      `${this.configService.get('HOST_CROL')}/Productos/ClaveProductoSAT?busqueda=${queryParam}`,
      {
        headers: {
          Authorization: crolToken,
        },
      },
    );
    return satKeys;
  }

  async getContact(queryParam: string) {
    const crolToken = `Bearer ${(await this.getFromDb())?.token}`;

    const contacts = await this.http.get(
      `${this.configService.get('HOST_CROL')}/Contactos?busqueda=${queryParam}`,
      {
        headers: {
          Authorization: crolToken,
        },
      },
    );
    return contacts;
  }
}
