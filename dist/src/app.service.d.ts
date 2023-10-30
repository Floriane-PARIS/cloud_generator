import { ConfigService } from '@nestjs/config';
import { EventsGateway } from './events.gateway';
export declare class AppService {
    private configService;
    private gateway;
    constructor(configService: ConfigService, gateway: EventsGateway);
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
    getDb(): Promise<any>;
}
