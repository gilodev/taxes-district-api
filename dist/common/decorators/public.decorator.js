"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiresApiKey = exports.REQUIRES_API_KEY = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.REQUIRES_API_KEY = 'requiresApiKey';
const RequiresApiKey = () => (0, common_1.SetMetadata)(exports.REQUIRES_API_KEY, true);
exports.RequiresApiKey = RequiresApiKey;
//# sourceMappingURL=public.decorator.js.map