import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly errorHandler: ErrorHandlingService,
    private readonly commonService: CommonService,
  ) {}

  private proyectToCode(supplier: Supplier) {
    return {
      ...supplier,
      resources: supplier.resources?.map((r) => ({
        ...r,
        proyectCode: r.proyect?.crol_id,
        proyect: r.proyect?.name,
      })),
    };
  }

  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const newSupplier = this.supplierRepository.create(createSupplierDto);

      const savedSupplier = await this.supplierRepository.save(newSupplier);
      return savedSupplier;
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async findAll() {
    const allSuppliers = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect(
        'supplier.resources',
        'resource',
        'resource.approved = true',
        { approved: true },
      )
      .leftJoinAndSelect('resource.proyect', 'proyect')
      .getMany();

    if (!allSuppliers.length)
      throw new NotFoundException("There's no suppliers registered");

    return allSuppliers.map((supplier) => this.proyectToCode(supplier));
  }

  async findAllPlain() {
    const allSuppliers = await this.findAll();
    const allSuppliersPlain = allSuppliers.map(
      ({ resources, ...data }) => data,
    );

    return allSuppliersPlain;
  }

  async findOne(id: string) {
    /*let findedSupplier: null | Supplier = null;

    const queryRelations = {
      relations: ['resources.proyect'],
    };

    findedSupplier = await this.supplierRepository.findOne({
      where: isUUID(id) ? { id } : { name: id },
      ...queryRelations,
    });*/

    const findedSupplier = await this.supplierRepository
      .createQueryBuilder('supplier')
      .leftJoinAndSelect(
        'supplier.resources',
        'resource',
        'resource.approved = true',
        { approved: true },
      )
      .leftJoinAndSelect('resource.proyect', 'proyect')
      .where('supplier.id = :id', { id })
      .leftJoinAndSelect('resource.category', 'category')
      .getOne();

    if (!findedSupplier)
      throw new NotFoundException('The supplier doesnt exists');

    return findedSupplier;
  }

  async findOnePlain(id: string) {
    const supplier = await this.findOne(id);

    return this.proyectToCode(supplier);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    await this.findOne(id);

    const supplierUpdated = await this.supplierRepository.preload({
      id,
      ...updateSupplierDto,
    });

    if (!supplierUpdated)
      throw new BadRequestException("The supplier doesn't exists");

    return this.commonService.handleTransaction(supplierUpdated);
  }

  async remove(id: string) {
    const supplier = await this.findOne(id);
    supplier.isActive = false;

    return this.commonService.handleTransaction(supplier);
  }
}
