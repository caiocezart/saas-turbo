import { Controller, Get } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";

@Controller("users")
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async getAll() {
    return this.userRepository.findAll();
  }
}
