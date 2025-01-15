import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enum/roles.enum';
import { UserService } from '../user.service';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService
        ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const roles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
      
      if (!roles) return true;
  
      const request = context.switchToHttp().getRequest();
      const {id} = request.user;
        
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new ForbiddenException('User not found');
      }
  
      // Check if the user's role is included in the allowed roles
      const hasRole = roles.includes(user.role as RoleEnum);
      if (!hasRole) {
        throw new ForbiddenException('You do not have permission to access this resource');
      }

      return true
    }
  }
