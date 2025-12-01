import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { PaginationDTO } from 'src/helpers/paginationDTO.dto';
import { Category } from '../resources/entities/category.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly ActivityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto) {
    const newActivityLog = this.ActivityLogRepository.create({
      ...createActivityLogDto,
      project: { id: createActivityLogDto.project },
      user: { id: createActivityLogDto.user },
      product: { id: createActivityLogDto.product },
    });

    const savedActivityLog =
      await this.ActivityLogRepository.save(newActivityLog);
    return savedActivityLog;
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { skip = 0, limit } = paginationDTO;
    const finalLimit = limit ?? 25;
    const [allLogs, count] = await this.ActivityLogRepository.findAndCount({
      relations: ['user', 'project', 'product'],
      skip: skip,
      take: finalLimit,
      order: { id: 'DESC' },
    });

    const pages = Math.ceil(+count / +finalLimit);

    if (!allLogs.length) throw new NotFoundException("There's no logs");

    const parsedLogs = allLogs.map(
      ({ project: proyect, user: userObj, product: productObj, ...data }) => ({
        ...data,
        proyect: proyect.name,
        proyectCode: proyect.bitracker_id,
        user: `${userObj.name} ${userObj.surname}`,
        product: productObj.name,
      }),
    );

    return {
      logs: parsedLogs,
      pages,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} activityLog`;
  }

  update(id: number, updateActivityLogDto: UpdateActivityLogDto) {
    return `This action updates a #${id} activityLog ${updateActivityLogDto.action}`;
  }

  remove(id: number) {
    return `This action removes a #${id} activityLog`;
  }
}
