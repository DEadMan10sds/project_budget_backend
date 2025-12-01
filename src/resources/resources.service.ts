import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { UsersService } from 'src/users/users.service';
import { CommonService } from '../common/common.service';
import { approveResources } from './resources.controller';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { CrolApiService } from 'src/crol-api/crol-api.service';
import { ProyectsService } from 'src/proyects/proyects.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { CreateCrolResourceDto } from 'src/crol-api/dto/createCrolResource.dto';
import { ResourceCounter } from './entities/resource_counter.entity';
import { ActivityLogService } from 'src/activity-log/activity-log.service';
import {
  ResourceWithRelations,
  ResourceWithRelationsPlain,
} from './interfaces';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class ResourcesService {
  private resourceIdentifier = 'MPP-'; //prod -> MPP || dev -> tst
  private umBaseId = 6; //CROL ID: unidad de medida base -> PIEZAS
  private umId = 811; //CROL id: Unidad de medida

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,

    @InjectRepository(ResourceCounter)
    private readonly resourceCounter: Repository<ResourceCounter>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    //private readonly satService: SatService,
    private readonly userService: UsersService,
    private readonly commonService: CommonService,
    private readonly crolApiService: CrolApiService,
    private readonly supplierService: SupplierService,
    private readonly proyectSservice: ProyectsService,
    private readonly errorHandler: ErrorHandlingService,
    private readonly activityLogger: ActivityLogService,
  ) {}

  async create(createResourceDto: CreateResourceDto, withCrol: boolean = true) {
    const { proyect, user, supplier, sat_code, category, ...data } =
      createResourceDto;

    const existsProyect = await this.proyectSservice.findOneById(proyect);
    const existsUser = await this.userService.findOne(user);
    const existsSupplier = await this.supplierService.findOne(supplier);
    const existsCategory = await this.findOneCategory(category);
    const currentCounter = await this.resourceCounter.findOneBy({ id: '1' });

    try {
      if (withCrol)
        await this.crolApiService.createResource({
          codigo: `${this.resourceIdentifier}${currentCounter?.total}`,
          metodoCosteo: 1,
          tipo: 1,
          umBaseId: this.umBaseId,
          umId: this.umId,
          nombre: createResourceDto.name,
          claveProdServ: createResourceDto.sat_code,
          agrupadorServicio: createResourceDto.service_group,
        } as CreateCrolResourceDto);

      const newResource = this.resourceRepository.create({
        ...data,
        type: 1,
        cost_method: 1,
        proyect: existsProyect,
        user: existsUser,
        supplier: existsSupplier,
        sat_code,
        category: existsCategory,
        crol_id: `${this.resourceIdentifier}${currentCounter?.total}`,
      });

      const savedResource = await this.resourceRepository.save(newResource);

      await this.activityLogger.create({
        action: 'crear',
        fromState: '',
        toState: 'pendiente',
        product: savedResource.id,
        project: savedResource.proyect.id,
        user: savedResource.user.id,
        date: new Date(),
      });

      return savedResource;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async findAll() {
    const allResources = await this.resourceRepository.find({
      where: { isActive: true },
    });

    if (!allResources || !allResources.length)
      throw new NotFoundException("There's no resources");

    return allResources;
  }

  async findOne(id: string) {
    let resourceFinded: Resource | null = null;

    resourceFinded = await this.resourceRepository.findOneBy({ id });

    if (!resourceFinded)
      throw new NotFoundException("The resource doesn't exists");

    return resourceFinded;
  }

  async findOneWithRelations(id: string) {
    const resourceFinded: ResourceWithRelations | null =
      await this.resourceRepository.findOne({
        where: { id },
        relations: ['user', 'proyect'],
      });

    if (!resourceFinded)
      throw new NotFoundException('Resource with relations not founded');

    const plainResource: ResourceWithRelationsPlain = {
      proyect: resourceFinded.proyect.id,
      user: resourceFinded.user.id,
      id: resourceFinded.id,
      toState: resourceFinded.status,
    };

    return plainResource;
  }

  async findResourcesOf(model: string, id: string) {
    const queryBuilder = this.resourceRepository.createQueryBuilder('res');

    const data = await queryBuilder
      .leftJoinAndSelect(`res.${model}`, 'joined')
      .where(`joined.id = :id`, { id })
      .getMany();

    if (!data || !data.length)
      throw new NotFoundException("There's no resourses");

    return data;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto) {
    const { user, proyect, supplier, category, ...data } = updateResourceDto;

    let dataToUpdate: Partial<Resource> = { ...data };

    //TODO: Optimize in function
    if (user) {
      const newUser = await this.userService.findOne(user);
      if (newUser.id !== user)
        dataToUpdate = { ...dataToUpdate, user: newUser };
    }

    if (category) {
      const newCategory = await this.findOneCategory(category);
      if (newCategory.id !== category)
        dataToUpdate = { ...dataToUpdate, category: newCategory };
    }

    if (proyect) {
      const newProyect = await this.proyectSservice.findOne(proyect);
      if (newProyect.id !== user)
        dataToUpdate = { ...dataToUpdate, proyect: newProyect };
    }

    if (supplier) {
      const newSupplier = await this.supplierService.findOne(supplier);
      if (newSupplier.id !== supplier)
        dataToUpdate = { ...dataToUpdate, supplier: newSupplier };
    }

    const resourceExsists = await this.resourceRepository.findOne({
      where: { id, approved: true },
    });

    if (!resourceExsists)
      throw new BadRequestException(`The resource isn't approved`);

    const resource = await this.resourceRepository.preload({
      id,
      ...dataToUpdate,
    });

    if (!resource) throw new BadRequestException("The proyect doesn't exists");

    await this.commonService.handleTransaction(resource);

    const res: ResourceWithRelationsPlain = await this.findOneWithRelations(
      resource.id,
    );

    return await this.activityLogger.create({
      project: res.proyect,
      user: res.user,
      product: res.id,
      fromState: resourceExsists.status ?? '', // o algún valor anterior si lo conoces
      toState: res.toState,
      action: 'actualización',
      date: new Date(),
    });
  }

  // TODO: Lookup for optimization
  async setApproved(items: approveResources) {
    const { resourcesToApprove } = items;

    if (!resourcesToApprove)
      throw new BadRequestException('Please send the resources id to approve');

    const itemsToUpdate = Array.isArray(resourcesToApprove)
      ? resourcesToApprove
      : [resourcesToApprove];

    return await Promise.all(
      itemsToUpdate.map(async (item: string) => {
        //If not's uuid doesn't search the item
        if (!isUUID(item)) return;

        //Preloads the transaction
        const updatedResource = await this.resourceRepository.preload({
          id: item,
          approved: items.approve,
        });

        //Verifies that the item exists
        if (!updatedResource) return;

        //Triggers the transaction
        const success =
          await this.commonService.handleTransaction(updatedResource);

        const res: ResourceWithRelationsPlain =
          await this.findOneWithRelations(item);

        await this.activityLogger.create({
          project: res.proyect,
          user: res.user,
          product: res.id,
          fromState: 'Sin aprobar', // o algún valor anterior si lo conoces
          toState: 'Aprobado',
          action: 'Aprobación',
          date: new Date(),
        });

        //Verify if the transaction was accomplished
        if (success) return item;
      }),
    );
  }

  async addCategory(categoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepository.create(categoryDto);
    const savedCategory = await this.categoryRepository.save(newCategory);

    if (!savedCategory)
      throw new BadRequestException("The category couldn't be saved");

    return savedCategory;
  }

  async findOneCategory(id: string) {
    const existsCategory = await this.categoryRepository.findOneBy({ id });

    if (!existsCategory)
      throw new NotFoundException("The category doesn't exists");
    return existsCategory;
  }

  async allCategories() {
    const allCategories = await this.categoryRepository
      .createQueryBuilder('categories')
      .getMany();

    if (!allCategories || !allCategories.length)
      throw new NotFoundException("There's no categories");

    return allCategories;
  }

  async remove(id: string) {
    const resource = await this.findOne(id);
    resource.isActive = false;

    return this.commonService.handleTransaction(resource);
  }
}
