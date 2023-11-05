import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
    OnGatewayConnection,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      //origin: "https://app-061c7eb9-4e4d-4bff-a3ba-ac5f184e2f25.cleverapps.io",
      origin: "*",
      methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  })
  
  export class EventsGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    sendToAll(msg: string) {
        this.server.emit('newMessage', msg);
    }

    sendToConversation(conversation_id: string, msg: string) {
      this.server.to(conversation_id).emit('newMessage', msg);
    }
  
    handleConnection(client: Socket, ...args: any[]) {
      console.log('New client connected');
      console.log(args);
      client.emit('connection', 'Successfully connected to server');
    }

    @SubscribeMessage('joinConversations')
    handleJoinConversations(client: Socket, payload: any): void {
      const conversation_id = payload.conversation_ids[0];
      console.log('Joining conversation, conversation_id:', conversation_id);
      client.join(conversation_id);
    }

    @SubscribeMessage('leaveConversations')
    handleLeaveConversations(client: Socket, payload: any): void {
      const conversation_id = payload.conversation_ids[0];
      console.log('Leaving conversation, conversation_id:', conversation_id);
      client.leave(conversation_id);
    }
  
    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): WsResponse<string> {
        console.log('Handling message', payload);
      const { idSender, idReceiver, msg } = payload;
      this.server.emit('newMessage', `New message from ${idSender} to ${idReceiver}: ${msg}`);
      return { event: 'message', data: 'Message received!' };
    }
  }
  