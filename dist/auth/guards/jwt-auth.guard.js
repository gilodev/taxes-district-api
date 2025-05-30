"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const public_decorator_2 = require("../../common/decorators/public.decorator");
const common_2 = require("@nestjs/common");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
        this.logger = new common_2.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiresApiKey = this.reflector.getAllAndOverride(public_decorator_2.REQUIRES_API_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic && !requiresApiKey) {
            return true;
        }
        if (requiresApiKey) {
            return this.validateApiKey(request);
        }
        try {
            const canActivate = await super.canActivate(context);
            if (!canActivate) {
                return false;
            }
            return true;
        }
        catch (error) {
            this.logger.error('Error in authentication', { error: error.message });
            throw new common_1.UnauthorizedException('Authentication failed');
        }
    }
    validateApiKey(request) {
        const apiKey = request.headers['x-api-key'];
        const validApiKeys = (process.env.API_KEYS ?? '')
            .split(',')
            .filter(Boolean);
        if (!apiKey || !validApiKeys.includes(apiKey)) {
            this.logger.warn('Invalid or missing API key');
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        return true;
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            this.logger.warn('JWT authentication failed', {
                error: err?.message,
                info,
            });
            throw new common_1.UnauthorizedException('Authentication failed');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map