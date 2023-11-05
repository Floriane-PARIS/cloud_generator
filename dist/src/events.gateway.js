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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    sendToAll(msg) {
        this.server.emit('newMessage', msg);
    }
    sendToConversation(conversation_id, msg) {
        this.server.to(conversation_id).emit('newMessage', msg);
    }
    handleConnection(client, ...args) {
        console.log('New client connected');
        console.log(args);
        client.emit('connection', 'Successfully connected to server');
    }
    handleJoinConversations(client, payload) {
        const conversation_id = payload.conversation_ids[0];
        console.log('Joining conversation, conversation_id:', conversation_id);
        client.join(conversation_id);
    }
    handleLeaveConversations(client, payload) {
        const conversation_id = payload.conversation_ids[0];
        console.log('Leaving conversation, conversation_id:', conversation_id);
        client.leave(conversation_id);
    }
    handleMessage(client, payload) {
        console.log('Handling message', payload);
        const { idSender, idReceiver, msg } = payload;
        this.server.emit('newMessage', `New message from ${idSender} to ${idReceiver}: ${msg}`);
        return { event: 'message', data: 'Message received!' };
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinConversations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleJoinConversations", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveConversations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLeaveConversations", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Object)
], EventsGateway.prototype, "handleMessage", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
            methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
            credentials: true,
        },
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map