import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ArrayContains, DataSource, Repository } from 'typeorm';
import { ErrorHandlingService } from 'src/error-handling/error-handling.service';
import { hashSync } from 'bcrypt';
import { isUUID } from 'class-validator';
import { PasswordToken } from './entities/token.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CronJob } from 'cron';
import { EmailsService } from 'src/emails/emails.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PasswordToken)
    private readonly tokenRepository: Repository<PasswordToken>,

    private readonly errorHandler: ErrorHandlingService,

    private readonly emailService: EmailsService,

    private readonly dataSource: DataSource,
  ) {
    new CronJob(
      '0 */1 * * * *',
      () => {
        void this.deleteAllTokens();
      },
      null,
      true,
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = hashSync(createUserDto.password, 10);

      const newUser = this.userRepository.create(createUserDto);

      const finalUser = await this.userRepository.save(newUser);
      return { ...finalUser, password: null };
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByRole(role: string) {
    return await this.userRepository.find({
      where: { roles: ArrayContains([role]) },
    });
  }

  findAll() {
    return this.userRepository.find({});
  }

  async findOne(id: string) {
    let user: User | null = null;

    if (isUUID(id)) user = await this.userRepository.findOneBy({ id });
    else {
      user = await this.userRepository.findOneBy({ name: id });
    }

    if (!user) throw new NotFoundException("The user doesn't exists");

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // eslint-disable-next-line prefer-const
    let { password, ...data } = updateUserDto;

    const existsUser = await this.userRepository.preload({
      id,
      ...data,
    });

    if (!existsUser) throw new BadRequestException("The user doesn't exists");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (password) {
        password = hashSync(password, 10);
        existsUser.password = password;
      }

      await queryRunner.manager.save(existsUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorHandler.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const existsUser = await this.findOne(id);
    if (!existsUser) throw new BadRequestException("The user doesn't exists");

    existsUser.isActive = false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(existsUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorHandler.handleError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteAllTokens() {
    const allTokens = await this.tokenRepository.find({});
    if (!allTokens.length) return;

    await Promise.all(
      allTokens.map(async (token) => {
        const expiration = new Date(token.expiration);

        if (expiration <= new Date()) await this.tokenRepository.remove(token);
      }),
    );
  }

  async createToken(email: string) {
    const existsUser = await this.userRepository.findOneBy({ email });

    if (!existsUser)
      throw new NotFoundException("There's no user with this email");

    const userHasToken = await this.tokenRepository.findOneBy({ email });
    if (userHasToken)
      throw new BadRequestException('The user already has a token');

    const token = Math.floor(1000000 + Math.random() * 9000000);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 2);

    try {
      const newToken = this.tokenRepository.create({
        token,
        email: existsUser.email,
        userId: existsUser.id,
        expiration,
      });

      await this.tokenRepository.save(newToken);

      await this.emailService.sendEmail({
        template: 'forgot-password',
        to: existsUser.email,
        context: {
          message: newToken.token,
        },
      });

      return;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating token');
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, newPassword } = data;
    const existsToken = await this.tokenRepository.findOneBy({ token: token });
    if (!existsToken)
      throw new BadRequestException('The token expired or is invalid');

    await this.update(existsToken.userId, {
      password: newPassword,
    });
  }
}
