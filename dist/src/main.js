"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const corsOptions = {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        optionsSuccessStatus: 204,
    };
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Reicever API')
        .setDescription('Routes for the reicever API')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors(corsOptions);
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    await app.listen(8080);
}
bootstrap();
//# sourceMappingURL=main.js.map