import { Injectable } from '@nestjs/common';
import type { CreateCohortDto, UpdateCohortDto } from '../../../../lib/contracts/src/dto/ncs-catalog.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { catalogResult, requireCatalogChanges } from './catalog-result.js';

@Injectable()
export class CohortService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.khoaHocNcs.findMany({
      select: { id: true, maKhoaHoc: true, namTuyenSinh: true, ghiChu: true },
      orderBy: [{ namTuyenSinh: 'desc' }, { maKhoaHoc: 'asc' }],
    });
  }

  get(id: string) {
    return catalogResult(this.prisma.khoaHocNcs.findUniqueOrThrow({ where: { id } }), 'niên khóa');
  }

  create(data: CreateCohortDto) {
    return catalogResult(this.prisma.khoaHocNcs.create({ data }), 'niên khóa');
  }

  update(id: string, data: UpdateCohortDto) {
    requireCatalogChanges(data);
    return catalogResult(this.prisma.khoaHocNcs.update({ where: { id }, data }), 'niên khóa');
  }

  delete(id: string) {
    return catalogResult(this.prisma.khoaHocNcs.delete({ where: { id } }), 'niên khóa');
  }
}
