import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway(8080)
  export class EventsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: any, ...args: any[]) {
      console.log('New client connected');
      client.emit('connection', 'Successfully connected to server');
    }
  
    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): WsResponse<string> {
      const { idSender, idReceiver, msg } = payload;
      this.server.emit('newMessage', `New message from ${idSender} to ${idReceiver}: ${msg}`);
      return { event: 'message', data: 'Message received!' };
    }
  }
  