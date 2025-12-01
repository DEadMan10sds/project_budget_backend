import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UsersService } from 'src/users/users.service';
import { RolesList } from 'src/users/static/roles';

@Controller('proyects')
export class ProyectsController {
  constructor(
    private readonly proyectsService: ProyectsService,
    private readonly userService: UsersService,
  ) {}

  //@Auth(RolesList.DIRECTOR, RolesList.COORDINATOR)
  @Post()
  async create(
    @Query('email') userEmail: string,
    @Body() createProyectDto: CreateProyectDto,
    @Query('withCrol') withCrol: boolean,
  ) {
    const existsUser = await this.userService.findByEmail(userEmail);
    if (
      existsUser &&
      (existsUser.roles.includes(RolesList.COORDINATOR) ||
        existsUser.roles.includes(RolesList.DIRECTOR))
    )
      return this.proyectsService.create(createProyectDto, withCrol);
    else throw new BadRequestException("The user isn't allowed");
  }

  @Auth()
  @Get()
  findAll() {
    return this.proyectsService.findAll();
  }

  @Auth()
  @Get('/allActive')
  findAllActive() {
    return this.proyectsService.findAllActive();
  }

  @Auth()
  @Get('/allActivePlain')
  findAllActivePlain() {
    return this.proyectsService.findAllActivePlain();
  }

  @Auth()
  @Get('/single/:id')
  findOne(@Param('id') id: string) {
    return this.proyectsService.findOne(id);
  }

  @Auth()
  @Get('/allPlain')
  findAllPlain() {
    return this.proyectsService.findAllPlain();
  }

  @Get('/singlePlain/:id')
  findOnePlain(@Param('id') id: string) {
    return this.proyectsService.findOnePlain(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectDto: UpdateProyectDto) {
    return this.proyectsService.update(id, updateProyectDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectsService.remove(id);
  }
}
