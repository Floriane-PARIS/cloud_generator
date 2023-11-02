import { PubSub } from '@google-cloud/pubsub';
import { ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
export declare class AppService {
    private configService;
    private gateway;
    constructor(configService: ConfigService, gateway: EventsGateway);
    private pubSubClient;
    onModuleInit(): void;
    createPubSubClient(): PubSub;
    listenForMessages(subscriptionNameOrId: string): void;
    reconnect(subscriptionNameOrId: string): void;
    receiveMessage(body: {
        _id: string;
        conversation_id: string;
        sender: string;
        timestamp: string;
        text: string;
        image: string;
        read_by: string[];
        smoke: boolean;
    }): string;
    getHello(): string;
    getHistory(): Promise<any>;
    getConversationHistory(id: string): Promise<any>;
    getConversation(id: string): Promise<any>;
    getStoriesViewableByUserId(userId: string): Promise<any>;
}
