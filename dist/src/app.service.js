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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongodb_1 = require("mongodb");
const { MongoClient } = require('mongodb');
const events_gateway_1 = require("./events.gateway");
let AppService = class AppService {
    constructor(configService, gateway) {
        this.configService = configService;
        this.gateway = gateway;
    }
    receiveMessage(body) {
        console.log("Conversation : " + body.conversation_id);
        console.log("New message sent by : " + body.sender);
        console.log("Message : ", body.text);
        console.log("Image : ", body.image);
        this.gateway.sendToAll(JSON.stringify(body));
        return "New message sent by " + body.sender + "\nMessage : " + body.text;
    }
    getHello() {
        return 'Hello World!';
    }
    async getDb() {
        const uri = this.configService.get('mongodb_uri');
        const dbName = this.configService.get('database_name');
        const collectionName = this.configService.get('collection_name');
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionName);
            const id = "653fa5b2991fd05dc55ef7d0";
            const query = { _id: new mongodb_1.ObjectId(id) };
            const result = await collection.findOne(query);
            console.log(result.messages);
            return result.messages;
        }
        catch (err) {
            console.log(err);
            return { error: err };
        }
        finally {
            await client.close();
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, events_gateway_1.EventsGateway])
], AppService);
//# sourceMappingURL=app.service.js.map