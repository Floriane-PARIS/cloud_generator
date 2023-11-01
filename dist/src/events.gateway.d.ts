import { WsResponse, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection {
    server: Server;
    sendToAll(msg: string): void;
    sendToConversation(conversation_id: string, msg: string): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleJoinConversations(client: Socket, conversation_ids: string[]): void;
    handleMessage(client: Socket, payload: any): WsResponse<string>;
}
