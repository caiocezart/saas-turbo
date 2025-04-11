import { PrismaService } from "../prisma/prisma.service";
type PrismaModel<T> = {
  findFirst: (args: any) => Promise<T | null>;
  findMany: (args: any) => Promise<T[]>;
  create: (args: { data: any }) => Promise<T>;
  update: (args: { where: { id: string }; data: any }) => Promise<T>;
  delete: (args: { where: { id: string } }) => Promise<T>;
};

export abstract class BaseRepository<T, C, U> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string
  ) {}

  private get getModel(): PrismaModel<T> {
    return this.prisma[this.modelName] as PrismaModel<T>;
  }

  async findById(id: string): Promise<T | null> {
    return await this.getModel.findFirst({
      where: {
        id,
      },
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
    await this.findById(id);

    return this.getModel.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    await this.findById(id);

    return this.getModel.delete({
      where: { id },
    });
  }
}
