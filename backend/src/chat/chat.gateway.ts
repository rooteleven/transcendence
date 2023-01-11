import { Logger } from '@nestjs/common';
import {  OnGatewayConnection,
          OnGatewayDisconnect,
          OnGatewayInit,
          SubscribeMessage,
          WebSocketGateway,
          WebSocketServer,
          WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log("INIT Transcendence !");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`${client.id} is connected`);
  } 
  
  handleDisconnect(client: Socket) {
    this.logger.log(`${client.id} is disconnected`);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: {sender: string, room: string, text: string}): void {
    this.wss.to(message.room).emit('msgToClient', message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

}
