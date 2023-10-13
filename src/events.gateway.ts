import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: "https://app-061c7eb9-4e4d-4bff-a3ba-ac5f184e2f25.cleverapps.io",
      methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  })
  
  export class EventsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: any, ...args: any[]) {
      console.log('New client connected');
      console.log(args);
      client.emit('connection', 'Successfully connected to server');
    }
  
    @SubscribeMessage('message')
    handleMessage(client: any, payload: any): WsResponse<string> {
        console.log('Handling message', payload);
      const { idSender, idReceiver, msg } = payload;
      this.server.emit('newMessage', `New message from ${idSender} to ${idReceiver}: ${msg}`);
      return { event: 'message', data: 'Message received!' };
    }
  }
  