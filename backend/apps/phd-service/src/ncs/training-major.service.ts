import { Injectable } from '@nestjs/common';
import type { CreateMajorDto, UpdateMajorDto } from '../../../../lib/contracts/src/dto/ncs-catalog.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { catalogResult, requireCatalogChanges } from './catalog-result.js';

@Injectable()
export class TrainingMajorService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.nganhDaoTao.findMany({
      select: { id: true, maNganh: true, tenNganh: true },
      orderBy: [{ tenNganh: 'asc' }, { maNganh: 'asc' }],
    });
  }

  get(id: number) {
    return catalogResult(this.prisma.nganhDaoTao.findUniqueOrThrow({ where: { id } }), 'ngành đào tạo');
  }

  create(data: CreateMajorDto) {
    return catalogResult(this.prisma.nganhDaoTao.create({ data }), 'ngành đào tạo');
  }

  update(id: number, data: UpdateMajorDto) {
    requireCatalogChanges(data);
    return catalogResult(this.prisma.nganhDaoTao.update({ where: { id }, data }), 'ngành đào tạo');
  }

  delete(id: number) {
    return catalogResult(this.prisma.nganhDaoTao.delete({ where: { id } }), 'ngành đào tạo');
  }
}
