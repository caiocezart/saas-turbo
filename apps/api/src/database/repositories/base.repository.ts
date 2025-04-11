import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

// Define a more specific type for Prisma models used in the repository
// This helps ensure we use the correct methods like findUnique
type PrismaModelDelegate<T> = {
  findUnique: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findUnique">
  ) => Promise<T | null>;
  findFirst: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findFirst">
  ) => Promise<T | null>; // Keep findFirst for flexibility if needed elsewhere
  findMany: (
    args: Prisma.Args<PrismaModelDelegate<T>, "findMany">
  ) => Promise<T[]>;
  create: (args: Prisma.Args<PrismaModelDelegate<T>, "create">) => Promise<T>;
  update: (args: Prisma.Args<PrismaModelDelegate<T>, "update">) => Promise<T>;
  delete: (args: Prisma.Args<PrismaModelDelegate<T>, "delete">) => Promise<T>;
};

export abstract class BaseRepository<T, C, U> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {}

  private get getModel(): PrismaModelDelegate<T> {
    // Use type assertion carefully, ensuring modelName corresponds to a valid Prisma model
    return this.prisma[
      this.modelName as keyof PrismaService
    ] as unknown as PrismaModelDelegate<T>;
  }

  async findById(id: string): Promise<T | null> {
    // Use findUnique for fetching by primary key (id)
    return this.getModel.findUnique({
      where: { id },
    });
  }

  async findAll(options: Record<string, unknown> = {}): Promise<T[]> {
    return this.getModel.findMany({
      ...options,
    });
  }

  async create(data: C): Promise<T> {
    return this.getModel.create({
      data,
    });
  }

  async update(id: string, data: Partial<U>): Promise<T> {
    // Removed findById check; Prisma handles non-existent records during update/delete

    return this.getModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    // Removed findById check; Prisma handles non-existent records during update/delete

    return this.getModel.delete({
      where: { id },
    });
  }
}
