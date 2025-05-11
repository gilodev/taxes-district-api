import { SetMetadata } from '@nestjs/common';

// For public access
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// For semi-public endpoint
export const REQUIRES_API_KEY = 'requiresApiKey';
export const RequiresApiKey = () => SetMetadata(REQUIRES_API_KEY, true);
