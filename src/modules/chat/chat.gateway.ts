import {
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // Track which admins are online
  private adminSockets: Map<string, Socket> = new Map();
  // Track user rooms
  private userRooms: Map<string, string> = new Map();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('Chat Gateway Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.adminSockets.delete(client.id);
    this.userRooms.delete(client.id);
  }

  // Admin joins the support dashboard
  @SubscribeMessage('adminJoin')
  async handleAdminJoin(@ConnectedSocket() client: Socket) {
    this.adminSockets.set(client.id, client);
    client.join('admins');

    // Send all existing rooms to admin
    const rooms = await this.chatService.getAllRooms();
    client.emit('roomsList', rooms);

    console.log(`Admin joined: ${client.id}`);
  }

  // User starts or rejoins a chat
  @SubscribeMessage('userJoin')
  async handleUserJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userName?: string; email?: string },
  ) {
    const roomId = payload.roomId || `user_${client.id}_${Date.now()}`;
    client.join(roomId);
    this.userRooms.set(client.id, roomId);

    // Send room history
    const messages = await this.chatService.getRoomMessages(roomId);
    client.emit('roomHistory', { roomId, messages: messages.reverse() });

    // Notify admins of new room
    this.server.to('admins').emit('roomUpdated', {
      roomId,
      userName: payload.userName || 'Guest',
      email: payload.email,
    });

    client.emit('roomJoined', { roomId });
    console.log(`User joined room: ${roomId}`);
  }

  @SubscribeMessage('trackPage')
  async handleTrackPage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; pageTitle: string; pageUrl: string },
  ) {
    const roomId = payload.roomId || this.userRooms.get(client.id);
    if (!roomId) return;

    // Notify admins about user's page movement
    this.server.to('admins').emit('userMoved', {
      roomId,
      pageTitle: payload.pageTitle,
      pageUrl: payload.pageUrl,
    });
  }

  // Admin joins a specific room to respond
  @SubscribeMessage('adminJoinRoom')
  async handleAdminJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    client.join(payload.roomId);
    await this.chatService.markRoomAsRead(payload.roomId);

    const messages = await this.chatService.getRoomMessages(payload.roomId);
    client.emit('roomHistory', { roomId: payload.roomId, messages: messages.reverse() });
  }

  // User sends a message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { 
      roomId: string; 
      message: string; 
      userName?: string; 
      email?: string;
      pageTitle?: string;
      pageUrl?: string;
      attachments?: string[];
    },
  ) {
    const roomId = payload.roomId || this.userRooms.get(client.id);
    if (!roomId) return;

    // Save user message
    const userMsg = await this.chatService.saveMessage({
      roomId,
      sender: 'user',
      senderName: payload.userName || 'Guest',
      senderEmail: payload.email,
      senderId: client.id,
      text: payload.message,
      pageTitle: payload.pageTitle,
      pageUrl: payload.pageUrl,
      attachments: payload.attachments || [],
    });

    // Broadcast to room (user + any admins watching)
    this.server.to(roomId).emit('messageReceived', {
      _id: userMsg._id,
      roomId,
      sender: 'user',
      senderName: payload.userName || 'Guest',
      senderEmail: payload.email,
      text: payload.message,
      pageTitle: payload.pageTitle,
      pageUrl: payload.pageUrl,
      attachments: payload.attachments || [],
      createdAt: new Date(),
    });

    // Notify all admins of new message
    this.server.to('admins').emit('newMessage', {
      roomId,
      userName: payload.userName || 'Guest',
      email: payload.email,
      text: payload.message,
    });

    // Check if any admin is in this room
    let adminInRoom = false;
    for (const [, adminSocket] of this.adminSockets) {
      if (adminSocket.rooms.has(roomId)) {
        adminInRoom = true;
        break;
      }
    }

    // Check if room is transferred to agent
    const roomState = await this.chatService.getAllRooms();
    const isTransferred = roomState.find(r => r._id === roomId)?.isTransferredToAgent;

    // If no admin is in the room and it's not transferred, generate AI response
    if (!adminInRoom && !isTransferred) {
      const aiResponse = await this.chatService.generateAIResponse(payload.message);

      const aiMsg = await this.chatService.saveMessage({
        roomId,
        sender: 'ai',
        senderName: 'SCPSN AI',
        text: aiResponse,
      });

      this.server.to(roomId).emit('messageReceived', {
        _id: aiMsg._id,
        roomId,
        sender: 'ai',
        senderName: 'SCPSN AI',
        text: aiResponse,
        createdAt: new Date(),
      });
    }

    // Update rooms list for admins
    const rooms = await this.chatService.getAllRooms();
    this.server.to('admins').emit('roomsList', rooms);
  }

  // Admin sends a reply
  @SubscribeMessage('adminReply')
  async handleAdminReply(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; message: string; adminName?: string; attachments?: string[] },
  ) {
    const adminMsg = await this.chatService.saveMessage({
      roomId: payload.roomId,
      sender: 'admin',
      senderName: payload.adminName || 'SCPSN Admin',
      senderId: client.id,
      text: payload.message,
      attachments: payload.attachments || [],
    });

    this.server.to(payload.roomId).emit('messageReceived', {
      _id: adminMsg._id,
      roomId: payload.roomId,
      sender: 'admin',
      senderName: payload.adminName || 'SCPSN Admin',
      text: payload.message,
      attachments: payload.attachments || [],
      createdAt: new Date(),
    });

    // Update rooms list
    const rooms = await this.chatService.getAllRooms();
    this.server.to('admins').emit('roomsList', rooms);
  }

  // Admin or user marks a message as read
  @SubscribeMessage('messageRead')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageId: string; roomId: string },
  ) {
    await this.chatService.updateMessageStatus(payload.messageId, 'read');
    this.server.to(payload.roomId).emit('statusUpdated', {
      messageId: payload.messageId,
      status: 'read',
    });
  }

  // Get predefined responses for admin/user
  @SubscribeMessage('getPredefinedResponses')
  async handleGetPredefinedResponses(@ConnectedSocket() client: Socket) {
    const responses = await this.chatService.getPredefinedResponses();
    client.emit('predefinedResponsesList', responses);
  }

  // Request Human Transfer
  @SubscribeMessage('requestHumanTransfer')
  async handleRequestTransfer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string },
  ) {
    const sysMsg = await this.chatService.saveMessage({
      roomId: payload.roomId,
      sender: 'ai',
      senderName: 'System',
      text: 'Transferring to a human agent. Please hold...',
      isTransferredToAgent: true,
    });

    this.server.to(payload.roomId).emit('messageReceived', {
      _id: sysMsg._id,
      roomId: payload.roomId,
      sender: 'ai',
      senderName: 'System',
      text: 'Transferring to a human agent. Please hold...',
      createdAt: new Date(),
    });

    const rooms = await this.chatService.getAllRooms();
    this.server.to('admins').emit('roomsList', rooms);
    this.server.to('admins').emit('transferRequested', { roomId: payload.roomId });
  }

  // Admin Accepts Transfer
  @SubscribeMessage('agentAcceptedTransfer')
  async handleAgentAcceptedTransfer(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; adminName?: string },
  ) {
    const adminName = payload.adminName || 'SCPSN Admin';
    const sysMsg = await this.chatService.saveMessage({
      roomId: payload.roomId,
      sender: 'ai',
      senderName: 'System',
      text: `${adminName} has joined the chat.`,
    });

    this.server.to(payload.roomId).emit('messageReceived', {
      _id: sysMsg._id,
      roomId: payload.roomId,
      sender: 'ai',
      senderName: 'System',
      text: `${adminName} has joined the chat.`,
      createdAt: new Date(),
    });

    client.join(payload.roomId);
  }

  // Rate Chat Session
  @SubscribeMessage('rateChatSession')
  async handleRateChatSession(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; rating: number },
  ) {
    await this.chatService.rateChatSession(payload.roomId, payload.rating);
    this.server.to('admins').emit('chatRated', { roomId: payload.roomId, rating: payload.rating });
  }
}

