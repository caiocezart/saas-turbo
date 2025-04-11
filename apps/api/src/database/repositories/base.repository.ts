import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

type PrismaModelDelegate<T> = {
  findUnique: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findUnique">
  ) => Promise<T | null>;
  findFirst: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findFirst">
  ) => Promise<T | null>;
  findMany: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findMany">
  ) => Promise<T[]>;
  create: (args: Prisma.Args<PrismaModelDelegate<T>, "create">) => Promise<T>;
  update: (args: Prisma.Args<PrismaModelDelegate<T>, "update">) => Promise<T>;
  delete: (args: Prisma.Args<PrismaModelDelegate<T>, "delete">) => Promise<T>;
  count: (
    args: Prisma.Args<PrismaModelDelegate<T>, "count">
  ) => Promise<number>;
  upsert: (args: Prisma.Args<PrismaModelDelegate<T>, "upsert">) => Promise<T>;
};

export abstract class BaseRepository<T, C, U> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {}

  private get getModel(): PrismaModelDelegate<T> {
    return this.prisma[
      this.modelName as keyof PrismaService
    ] as unknown as PrismaModelDelegate<T>;
  }

  async findById(id: string): Promise<T | null> {
    return this.getModel.findUnique({
      where: { id },
    });
  }

  async findFirst(options: Record<string, unknown> = {}): Promise<T | null> {
    return this.getModel.findFirst({
      ...options,
    });
  }

  async findAll(options: Record<string, unknown> = {}): Promise<T[]> {
    return this.getModel.findMany({
      ...options,
    });
  }

  async count(options: Record<string, unknown> = {}): Promise<number> {
    return this.getModel.count({
      ...options,
    });
  }

  async create(data: C): Promise<T> {
    return this.getModel.create({
      data,
    });
  }

  async update(id: string, data: Partial<U>): Promise<T> {
    return this.getModel.update({
      where: { id },
      data,
    });
  }

  async upsert(
    where: Record<string, unknown>,
    create: C,
    update: Partial<U>
  ): Promise<T> {
    return this.getModel.upsert({
      where,
      create,
      update,
    });
  }

  async delete(id: string): Promise<T> {
    return this.getModel.delete({
      where: { id },
    });
  }
}
