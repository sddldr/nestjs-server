import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      where: { status: ProjectStatus.ACTIVE },
    });
  }

  create(dto: {
    product: string;
    price: number;
    number: number;
    description?: string;
  }) {
    return this.prisma.project.create({
      data: {
        product: dto.product,
        price: dto.price,
        number: dto.number,
        description: dto.description,
        // ownerId: userId,
        status: ProjectStatus.ACTIVE,
      },
    });
  }

  update(
    dto: Partial<{
      product: string;
      price: number;
      number: number;
      status: ProjectStatus;
      description: string;
      id: number;
    }>,
  ) {
    return this.prisma.project.updateMany({
      where: { id: dto.id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.project.updateMany({
      where: { id },
      data: { status: ProjectStatus.DELETED },
    });
  }
}
