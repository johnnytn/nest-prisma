import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { generatePassword, hashPassword } from 'src/utils/utils';
import {
  HISTORY_METADATA_REQUIRED,
  HISTORY_SYMBOL_REQUIRED,
  HISTORY_USER_ID_REQUIRED,
  USER_EMAIL_REQUIRED,
  USER_ROLE_NOT_ALLOWED,
  USER_ROLE_REQUIRED,
} from 'src/utils/messages/user';
import { RoleType } from './entities/user.entity';
import { CreateHistoryDto } from './dto/create-history.dto';
import { GrouppedHistoryBySymbol } from 'src/commons/types/stock.types';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a basic user
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto) {
    try {
      this.validateNewUserData(createUserDto);

      const { email, role } = createUserDto;
      const generatedPassword = generatePassword();
      const password = await hashPassword(generatedPassword);

      await this.prismaService.user.create({
        data: {
          email,
          role,
          password,
        },
      });
      return {
        email,
        password: generatedPassword,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  update(id: string, payload: UpdateUserDto) {
    return this.prismaService.user.update({
      data: payload,
      where: {
        id,
      },
    });
  }
  remove(id: string) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }

  /**
   * Create a history for a requested symbol related to the given user
   * @param createHistoryDto
   */
  async createHistory(createHistoryDto: CreateHistoryDto) {
    try {
      this.validateNewHistoryData(createHistoryDto);

      const { userId, symbol, metadata } = createHistoryDto;
      // TODO: check why the order is changing
      await this.prismaService.history.create({
        data: {
          symbol,
          userId: userId,
          metadata: metadata,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findHistoriesByUserId(userId: string) {
    const data = await this.prismaService.history.findMany({
      where: { userId },
      select: {
        metadata: true,
      },
    });

    return data.map((d) => d.metadata);
  }

  /**
   * Return the most requested stocks
   * @param limit - set the number of stocks will be listed ( default 5)
   * @returns
   */
  async findMostRequestedStocks(limit: number = 5) {
    const data = await this.prismaService.history.groupBy({
      by: ['symbol'],
      _count: {
        symbol: true,
      },
      orderBy: {
        _count: {
          symbol: 'desc',
        },
      },
      // Limit to 5
      take: limit,
    });

    return data ? this.mapStats(data) : [];
  }

  private validateNewUserData(createUserDto: CreateUserDto) {
    if (!createUserDto.email) throw new Error(USER_EMAIL_REQUIRED);
    if (!createUserDto.role) throw new Error(USER_ROLE_REQUIRED);
    if (!Object.values(RoleType).includes(createUserDto.role))
      throw new Error(USER_ROLE_NOT_ALLOWED);
    return true;
  }

  private validateNewHistoryData(data: CreateHistoryDto) {
    if (!data.userId) throw new Error(HISTORY_USER_ID_REQUIRED);
    if (!data.symbol) throw new Error(HISTORY_SYMBOL_REQUIRED);
    if (!data.metadata) throw new Error(HISTORY_METADATA_REQUIRED);

    return true;
  }

  private mapStats(data: GrouppedHistoryBySymbol[]) {
    return data.map((d) => {
      return {
        stock: d.symbol,
        times_requested: d._count.symbol,
      };
    });
  }
}
