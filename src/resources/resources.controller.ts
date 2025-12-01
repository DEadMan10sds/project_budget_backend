import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ParseEnumPipe,
  Query,
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesList } from 'src/users/static/roles';
import { CreateCategoryDto } from './dto/create-category.dto';

enum Models {
  User = 'user',
  Proyect = 'proyect',
}

export interface approveResources {
  resourcesToApprove: string | string[];
  approve: boolean;
}

@Auth()
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Auth(RolesList.COORDINATOR, RolesList.DIRECTOR, RolesList.ENGINEER)
  @Post()
  create(
    @Body() createResourceDto: CreateResourceDto,
    @Query('withCrol') withCrol: boolean,
  ) {
    return this.resourcesService.create(createResourceDto, withCrol);
  }

  @Get()
  findAll() {
    return this.resourcesService.findAll();
  }

  @Get('/categories')
  findAllCategories() {
    return this.resourcesService.allCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Get('/withRelations/:id')
  findOneWithRelations(@Param('id') id: string) {
    return this.resourcesService.findOneWithRelations(id);
  }

  @Get('/of/:model/:id')
  findResourcesOf(
    @Param('model', new ParseEnumPipe(Models)) model: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.resourcesService.findResourcesOf(model, id);
  }

  @Auth(RolesList.COORDINATOR, RolesList.DIRECTOR)
  @Patch('/changeApprove')
  approveResources(@Body() items: approveResources) {
    return this.resourcesService.setApproved(items);
  }

  @Auth(RolesList.BUYER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Post('/category')
  createCategory(@Body() createCategory: CreateCategoryDto) {
    return this.resourcesService.addCategory(createCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
