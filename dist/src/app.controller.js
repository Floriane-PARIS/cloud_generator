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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const swagger_1 = require("@nestjs/swagger");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
    receiveMessage(body) {
        console.log("Conversation : " + body.conversation_id);
        return this.appService.receiveMessage(body);
    }
    async getHistory() {
        return await this.appService.getHistory();
    }
    async getConversationHistory(id) {
        return await this.appService.getConversationHistory(id);
    }
    async getConversation(id) {
        return await this.appService.getConversation(id);
    }
    async getStoriesByUserId(userId) {
        try {
            return await this.appService.getStoriesViewableByUserId(userId);
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to get stories: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get Hello Message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return a hello message.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('message'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Receive Message' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                _id: { type: 'string', example: '1' },
                conversation_id: { type: 'string', example: '123' },
                sender: { type: 'string', example: 'user1' },
                timestamp: { type: 'string', example: '2023-11-01T00:00:00Z' },
                text: { type: 'string', example: 'Hello' },
                image: { type: 'string', example: 'http://example.com/image.jpg' },
                read_by: { type: 'array', items: { type: 'string' }, example: ['user1', 'user2'] },
                smoke: { type: 'boolean', example: false },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message received successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "receiveMessage", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get History' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the history.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('conversation/:id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Conversation History' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the conversation history based on id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConversationHistory", null);
__decorate([
    (0, common_1.Get)('conversation/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Conversation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the conversation based on id.' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'string' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)('users/:userId/stories/viewable'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Stories viewable by a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the stories viewable by a user.' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getStoriesByUserId", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('Server'),
    (0, common_1.Controller)('server'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map