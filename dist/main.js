"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const common_1 = require("@nestjs/common");
const compression = require("compression");
let app;
async function bootstrap() {
    if (!app) {
        const expressApp = express();
        app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
        app.use(compression({
            threshold: 1024,
            level: 6,
        }));
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ extended: true, limit: '50mb' }));
        const environment = process.env.NODE_ENV || 'development';
        const allowedOrigins = (process.env.CORS_ORIGINS || '')
            .split(',')
            .filter((origin) => origin.trim() !== '');
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin ||
                    environment === 'development' ||
                    allowedOrigins.length === 0) {
                    return callback(null, true);
                }
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = 'CORS policy violation: origin not allowed';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With, X-API-Key',
            credentials: true,
            maxAge: 3600,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    }
    return app.getHttpAdapter().getInstance();
}
async function handler(req, res) {
    const server = await bootstrap();
    server(req, res);
}
if (require.main === module) {
    bootstrap().then((server) => {
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log(`Application is running on: http://localhost:${port}`);
        });
    });
}
//# sourceMappingURL=main.js.map