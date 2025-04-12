import { Injectable } from "@nestjs/common";
import { BaseRepository } from "@/core/database/repositories/base.repository";
import { PrismaService } from "@/core/database/prisma/prisma.service";
import { Prisma, Provider } from "@/prisma/client";

@Injectable()
export class ProviderRepository extends BaseRepository<
  Provider,
  Prisma.ProviderCreateInput,
  Prisma.ProviderUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "provider");
  }
}
