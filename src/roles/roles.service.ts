import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoleDto } from './dto/createRole.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    return await this.prisma.role.create({ data: dto });
  }

  async getRoleByValue(value: string) {
    return await this.prisma.role.findUnique({ where: { value } });
  }

  async getAllRoles() {
    return await this.prisma.role.findMany();
  }
}
