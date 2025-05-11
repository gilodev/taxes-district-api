import {
    Injectable,
    ExecutionContext,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';
  import { REQUIRES_API_KEY } from '@/common/decorators/public.decorator';
  import { Logger } from '@nestjs/common';
  
  @Injectable()
  export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);
  
    constructor(
      private reflector: Reflector,
    ) {
      super();
    }
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
  
      // Check if the endpoint is marked as public
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      // Check if the endpoint requires an API key
      const requiresApiKey = this.reflector.getAllAndOverride<boolean>(
        REQUIRES_API_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (isPublic && !requiresApiKey) {
        return true;
      }
  
      if (requiresApiKey) {
        return this.validateApiKey(request);
      }
  
      // Standard JWT authentication
      try {
        // Basic JWT verification by passport's AuthGuard
        const canActivate = await super.canActivate(context);
        if (!canActivate) {
          return false;
        }
 
        return true;
      } catch (error) {
        this.logger.error('Error in authentication', { error: error.message });
        throw new UnauthorizedException('Authentication failed');
      }
    }
  
    private validateApiKey(request: any): boolean {
      const apiKey = request.headers['x-api-key'];
      const validApiKeys = (process.env.API_KEYS ?? '')
        .split(',')
        .filter(Boolean);
  
      if (!apiKey || !validApiKeys.includes(apiKey)) {
        this.logger.warn('Invalid or missing API key');
        throw new UnauthorizedException('Invalid API key');
      }
  
      return true;
    }
  
    handleRequest(err, user, info) {
      if (err || !user) {
        this.logger.warn('JWT authentication failed', {
          error: err?.message,
          info,
        });
        throw new UnauthorizedException('Authentication failed');
      }
      return user;
    }
  }
  