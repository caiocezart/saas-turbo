import { Injectable } from "@nestjs/common";
import { OrganizationRepository } from "@/database/repositories/organization.repository";
import { MembershipRepository } from "@/database/repositories/membership.repository";
import {
  MembershipUpdate,
  OrganizationUpdate,
  PrismaRoles,
} from "@repo/domain";

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly membershipRepository: MembershipRepository
  ) {}

  async findAll() {
    return await this.organizationRepository.findAll();
  }

  async createOrganization(name: string) {
    return await this.organizationRepository.create({
      name,
      slug: this.generateSlug(name),
    });
  }

  async updateOrganization(organizationId: string, input: OrganizationUpdate) {
    await this.organizationRepository.update(organizationId, {
      ...input,
    });
  }

  async getOrganizationById(organizationId: string) {
    return await this.organizationRepository.findById(organizationId);
  }

  async deleteOrganization(organizationId: string) {
    await this.organizationRepository.delete(organizationId);
  }

  async createMembership(
    organizationId: string,
    memberId: string,
    role: PrismaRoles
  ) {
    await this.membershipRepository.createMembership(
      organizationId,
      memberId,
      role
    );
  }

  async updateMembership(organizationId: string, membership: MembershipUpdate) {
    await this.membershipRepository.updateMembership(
      organizationId,
      membership
    );
  }

  async deleteMembership(organizationId: string, membershipId: string) {
    await this.membershipRepository.deleteMembership(
      organizationId,
      membershipId
    );
  }

  private generateSlug(text: string) {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD") // Normalize accented characters
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars except hyphen
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }
}
