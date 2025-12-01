import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { compareSync } from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true, roles: true },
    });

    if (!user) throw new UnauthorizedException('Credentials not valid');

    const validPassword = compareSync(password, user?.password);

    if (!validPassword)
      throw new UnauthorizedException('Credentials not valid');

    return {
      ...user,
      password: null,
      token: this.getJwt({ id: user.id }),
    };
  }

  getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  refresh(refreshToken: string) {
    console.log(refreshToken);
    return { data: 'hey' };
  }
}
