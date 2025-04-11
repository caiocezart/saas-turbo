import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base.repository";
import { PrismaService } from "@/database/prisma/prisma.service";
import { Organization, Prisma } from "@prisma/client";

@Injectable()
export class OrganizationRepository extends BaseRepository<
  Organization,
  Prisma.OrganizationCreateInput,
  Prisma.OrganizationUpdateInput
> {
  constructor(prisma: PrismaService) {
    super(prisma, "organization");
  }
}
