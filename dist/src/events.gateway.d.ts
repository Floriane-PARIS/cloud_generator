import { WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { Server } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection {
    server: Server;
    sendToAll(msg: string): void;
    handleConnection(client: any, ...args: any[]): void;
    handleMessage(client: any, payload: any): WsResponse<string>;
}
