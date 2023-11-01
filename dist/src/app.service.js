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
const pubsub_1 = require("@google-cloud/pubsub");
const config_1 = require("@nestjs/config");
const mongodb_1 = require("mongodb");
const { MongoClient } = require('mongodb');
const events_gateway_1 = require("./events.gateway");
let AppService = class AppService {
    constructor(configService, gateway) {
        this.configService = configService;
        this.gateway = gateway;
    }
    onModuleInit() {
        this.pubSubClient = this.createPubSubClient();
        const subscriptionNameOrId = this.configService.get('google_subscription_id');
        this.listenForMessages(subscriptionNameOrId);
    }
    createPubSubClient() {
        const credentialsJson = this.configService.get('google_application_credentials_content');
        const credentials = JSON.parse(credentialsJson);
        const pubSubClient = new pubsub_1.PubSub({
            projectId: credentials.project_id,
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key,
            },
        });
        return pubSubClient;
    }
    listenForMessages(subscriptionNameOrId) {
        const subscription = this.pubSubClient.subscription(subscriptionNameOrId);
        const isJsonString = (str) => {
            try {
                JSON.parse(str);
            }
            catch (e) {
                return false;
            }
            return true;
        };
        const messageHandler = (message) => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data.toString()}`);
            console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);
            message.ack();
            const messageData = message.data.toString();
            if (isJsonString(messageData)) {
                this.receiveMessage(JSON.parse(messageData));
            }
            else {
                console.warn('Received a non-JSON message:', messageData);
            }
        };
        subscription.on('message', messageHandler);
        subscription.on('error', error => {
            console.error(`Received error: ${error.message}`);
            this.reconnect(subscriptionNameOrId);
        });
    }
    reconnect(subscriptionNameOrId) {
        setTimeout(() => {
            console.log('Attempting to reconnect...');
            this.listenForMessages(subscriptionNameOrId);
        }, 5000);
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
    async getHistory() {
        const uri = this.configService.get('mongodb_uri');
        const dbName = this.configService.get('database_name');
        const collectionName = this.configService.get('collection_conversation');
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
    async getConversationHistory(id) {
        const uri = this.configService.get('mongodb_uri');
        const dbName = this.configService.get('database_name');
        const collectionConversation = this.configService.get('collection_conversation');
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionConversation);
            const query = { _id: new mongodb_1.ObjectId(id) };
            const result = await collection.findOne(query);
            if (result) {
                console.log(result.messages);
                return result.messages;
            }
            else {
                return { error: 'Conversation not found' };
            }
        }
        catch (err) {
            console.log(err);
            return { error: err };
        }
        finally {
            await client.close();
        }
    }
    async getConversation(id) {
        const uri = this.configService.get('mongodb_uri');
        const dbName = this.configService.get('database_name');
        const collectionConversation = this.configService.get('collection_conversation');
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionConversation);
            const query = { _id: new mongodb_1.ObjectId(id) };
            const result = await collection.findOne(query);
            if (result) {
                console.log(result);
                return result;
            }
            else {
                return { error: 'Conversation not found' };
            }
        }
        catch (err) {
            console.log(err);
            return { error: err };
        }
        finally {
            await client.close();
        }
    }
    async getStories(storyIds) {
        const uri = this.configService.get('mongodb_uri');
        const dbName = this.configService.get('database_name');
        const collectionStory = this.configService.get('collection_story');
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const database = client.db(dbName);
            const collection = database.collection(collectionStory);
            const query = { _id: { $in: storyIds.map(id => new mongodb_1.ObjectId(id)) } };
            const result = await collection.find(query).toArray();
            if (result) {
                console.log(result);
                return result;
            }
            else {
                return { error: 'Stories not found' };
            }
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