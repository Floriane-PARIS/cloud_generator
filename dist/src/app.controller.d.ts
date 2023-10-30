import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
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
    getDb(): Promise<any>;
}
