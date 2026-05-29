import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/abstracts',
})
export class AbstractsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected to abstracts: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from abstracts: ${client.id}`);
  }

  @SubscribeMessage('adminJoin')
  handleAdminJoin(@ConnectedSocket() client: Socket) {
    client.join('admins');
    console.log(`Admin joined abstracts room: ${client.id}`);
  }

  notifyNewAbstract(abstract: any) {
    this.server.to('admins').emit('new-abstract', abstract);
  }
}
