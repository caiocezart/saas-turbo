// import { AuthService } from "@/modules/auth/services/auth.service";
// import { CHECK_POLICIES_KEY } from "@/modules/security/decorators/policies.decorator";
// import { PoliciesAbilityFactory } from "@/modules/security/policies-ability.factory";
// import {
//   Action,
//   AppAbility,
//   RequiredPermission,
// } from "@/modules/security/types";
// import { UserService } from "@/modules/users/services/user.service";
// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { JwtUserPayload, caslUserSchema } from "@repo/domain";

// @Injectable()
// export class PoliciesGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private policiesFactory: PoliciesAbilityFactory,
//     private authService: AuthService,
//     private userService: UserService
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredPermissions =
//       this.reflector.get<RequiredPermission[]>(
//         CHECK_POLICIES_KEY,
//         context.getHandler()
//       ) || [];

//     if (requiredPermissions.length === 0) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const userPayload = request.user as JwtUserPayload;

//     if (!userPayload || !userPayload.organizationId) {
//       return false;
//     }
//     const user = await this.userService.findById(userPayload.sub);
//     if (!user) {
//       return false;
//     }
//     const membership = await this.authService.findMembership(
//       userPayload.organizationId,
//       userPayload.sub
//     );
//     if (!membership) {
//       return false;
//     }

//     const caslUser = caslUserSchema.parse(user);
//     const ability = this.policiesFactory.defineAbilityFor(
//       caslUser,
//       membership.role
//     );
//     console.log(ability.can(Action.Manage, "User"));
//     console.log(ability.cannot(Action.Read, "User"));
//     console.log(ability.can(Action.Read, "User"));
//     console.log(ability.can(Action.Delete, "User"));
//     console.log(ability.can(Action.Update, "User"));

//     return requiredPermissions.every((permission) =>
//       this.isAllowed(ability, permission)
//     );
//   }

//   // private execPolicyHandler(handler: PoliciesHandler, ability: AppAbility) {
//   //   if (typeof handler === "function") {
//   //     return handler(ability);
//   //   }
//   //   return handler.handle(ability);
//   // }

//   private isAllowed(
//     ability: AppAbility,
//     permission: RequiredPermission
//   ): boolean {
//     return ability.can(...permission);
//   }
// }
