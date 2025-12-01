import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Proyect } from './entities/proyect.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CommonService } from 'src/common/common.service';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CrolApiService } from 'src/crol-api/crol-api.service';

import { proyectToPlain } from '../helpers/toPlain';
import { ProjectCounter } from './entities/project-counter.entity';

function formatWithP(num: number): string {
  return `P${num.toString().padStart(4, '0')}`;
}

@Injectable()
export class ProyectsService {
  private pbsRegex = new RegExp('[A-Za-z]+-[0-9]+');

  constructor(
    @InjectRepository(Proyect)
    private readonly proyectRepository: Repository<Proyect>,

    @InjectRepository(ProjectCounter)
    private readonly projectCounterRepository: Repository<ProjectCounter>,

    private readonly errorHandler: ErrorHandlingService,
    private readonly userService: UsersService,
    private readonly commonService: CommonService,
    private readonly notificationService: NotificationsService,
    private readonly crolService: CrolApiService,
  ) {}

  //Consider moving it to common or user services

  async getLastProject() {
    const lastProject = await this.projectCounterRepository.findOneBy({
      id: 1,
    });

    if (!lastProject) throw new BadRequestException('No hay contador');
    return lastProject;
  }

  async getNextProjectId() {
    const lastProject = await this.getLastProject();
    return formatWithP(lastProject.counter);
  }

  async updateNextProjectId() {
    const lastProject = await this.getLastProject();
    const counter = ++lastProject.counter;

    const updatedCounter = await this.projectCounterRepository.preload({
      id: lastProject.id,
      counter,
    });

    return await this.commonService.handleTransaction(updatedCounter);
  }

  async create(createProyectDto: CreateProyectDto, withCrol: boolean = true) {
    let seller: User | null = null;
    seller = await this.userService.findOne(createProyectDto.seller);

    if (!seller)
      throw new BadRequestException("There's no seller with this name or id");

    const existsProject = await this.proyectRepository.findOneBy({
      external_id: createProyectDto.external_id,
    });

    if (existsProject)
      throw new BadRequestException(
        "There's already a project with this information",
      );

    const nextProjectId = await this.getNextProjectId();
    try {
      let divisionId: number = -1;
      let createdProyectInCrol: { divisionId: number };
      if (withCrol) {
        createdProyectInCrol = await this.crolService.createProyect({
          divisionNombre: `${createProyectDto.name} ${nextProjectId}`,
          divisionCodigo: nextProjectId,
          centroCostoId: 16775,
          divisionActiva: true,
          exentoIVA: true,
          controlActivosFijos: false,
          divisionIdPadre: 0,
          divisionId,
        });

        divisionId = createdProyectInCrol.divisionId;
      }

      const newProyect = this.proyectRepository.create({
        ...createProyectDto,
        crol_id: nextProjectId,
        divisionId,
        seller,
      });

      this.notificationService.notifyBroadcast(newProyect);

      const savedProyect = await this.proyectRepository.save(newProyect);

      await this.updateNextProjectId();

      return savedProyect;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async findAllPlain() {
    const proyects = await this.findAll();

    return proyects.map((proyect) => proyectToPlain(proyect));
  }

  async findAllActivePlain() {
    const proyectsFinded = await this.proyectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.seller', 'users')
      .where('project.isActive = :isActive', { isActive: true })
      .orderBy('project.crol_id', 'ASC')
      .getMany();

    return proyectsFinded.map((proyect) => proyectToPlain(proyect));
  }

  async findAllActive() {
    const proyectsActive = await this.proyectRepository.find({
      where: {
        isActive: true,
      },
    });

    return proyectsActive;
  }

  async findAll() {
    return await this.proyectRepository.find();
  }

  async findOnePlain(id: string) {
    const searchBy: string = id.includes('PBS') ? 'external_id' : 'id';
    const proyectFinded: Proyect | null = await this.proyectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.seller', 'users')
      .leftJoinAndSelect('project.resources', 'resource')
      .leftJoinAndSelect('resource.supplier', 'supplier')
      .leftJoinAndSelect('resource.user', 'user')
      .where(`project.${searchBy} = :id`, { id })
      .getOne();

    if (!proyectFinded)
      throw new NotFoundException("There's no project with this term");

    return proyectToPlain(proyectFinded);
  }

  async findOneById(id: string) {
    const findedProject = await this.proyectRepository.findOneBy({ id });

    if (!findedProject)
      throw new NotFoundException("There's no project with this id");

    return findedProject;
  }

  async findOne(id: string) {
    let proyectFinded: Proyect | null = null;
    if (id.includes('PBS-')) {
      proyectFinded = await this.proyectRepository.findOneBy({
        external_id: id,
      });
    } else if (this.pbsRegex.test(id)) {
      proyectFinded = await this.proyectRepository.findOneBy({ crol_id: id });
    } else {
      proyectFinded = await this.proyectRepository.findOneBy({ name: id });
    }

    if (!proyectFinded)
      throw new NotFoundException("There's no proyect with this term");

    if (proyectFinded.resources?.length) {
      let totalPriceEstimated: number = 0;
      let totalPriceReal: number = 0;

      proyectFinded.resources.forEach((resource) => {
        totalPriceEstimated += +resource.estimated_price;
        totalPriceReal += +resource.real_price;
      });
      proyectFinded.estimated_price = totalPriceEstimated;
      proyectFinded.real_price = totalPriceReal;
    }

    return proyectFinded;
  }

  async update(id: string, updateProyectDto: UpdateProyectDto) {
    const { seller, ...dataToUpdate } = updateProyectDto;
    let newSeller: User;

    const existsProject = await this.findOne(id);

    await this.crolService.createProyect({
      divisionId: existsProject.divisionId,
      divisionCodigo: existsProject.crol_id,
      ...dataToUpdate,
    });

    const proyect = await this.proyectRepository.preload({
      id,
      ...dataToUpdate,
    });

    if (!proyect) throw new BadRequestException("The proyect doesn't exists");

    if (seller) {
      newSeller = await this.userService.findOne(seller);
      if (newSeller !== proyect.seller) proyect.seller = newSeller;
    }

    await this.commonService.handleTransaction(proyect);
  }

  async remove(id: string) {
    const proyect = await this.findOne(id);
    proyect.isActive = false;

    await this.commonService.handleTransaction(proyect);
  }
}
