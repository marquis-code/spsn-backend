"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    chatService;
    server;
    adminSockets = new Map();
    userRooms = new Map();
    constructor(chatService) {
        this.chatService = chatService;
    }
    afterInit(server) {
        console.log('Chat Gateway Initialized');
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.adminSockets.delete(client.id);
        this.userRooms.delete(client.id);
    }
    async handleAdminJoin(client) {
        this.adminSockets.set(client.id, client);
        client.join('admins');
        const rooms = await this.chatService.getAllRooms();
        client.emit('roomsList', rooms);
        console.log(`Admin joined: ${client.id}`);
    }
    async handleUserJoin(client, payload) {
        const roomId = payload.roomId || `user_${client.id}_${Date.now()}`;
        client.join(roomId);
        this.userRooms.set(client.id, roomId);
        const messages = await this.chatService.getRoomMessages(roomId);
        client.emit('roomHistory', { roomId, messages: messages.reverse() });
        this.server.to('admins').emit('roomUpdated', {
            roomId,
            userName: payload.userName || 'Guest',
            email: payload.email,
        });
        client.emit('roomJoined', { roomId });
        console.log(`User joined room: ${roomId}`);
    }
    async handleTrackPage(client, payload) {
        const roomId = payload.roomId || this.userRooms.get(client.id);
        if (!roomId)
            return;
        this.server.to('admins').emit('userMoved', {
            roomId,
            pageTitle: payload.pageTitle,
            pageUrl: payload.pageUrl,
        });
    }
    async handleAdminJoinRoom(client, payload) {
        client.join(payload.roomId);
        await this.chatService.markRoomAsRead(payload.roomId);
        const messages = await this.chatService.getRoomMessages(payload.roomId);
        client.emit('roomHistory', { roomId: payload.roomId, messages: messages.reverse() });
    }
    async handleMessage(client, payload) {
        const roomId = payload.roomId || this.userRooms.get(client.id);
        if (!roomId)
            return;
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
        this.server.to('admins').emit('newMessage', {
            roomId,
            userName: payload.userName || 'Guest',
            email: payload.email,
            text: payload.message,
        });
        let adminInRoom = false;
        for (const [, adminSocket] of this.adminSockets) {
            if (adminSocket.rooms.has(roomId)) {
                adminInRoom = true;
                break;
            }
        }
        const roomState = await this.chatService.getAllRooms();
        const isTransferred = roomState.find(r => r._id === roomId)?.isTransferredToAgent;
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
        const rooms = await this.chatService.getAllRooms();
        this.server.to('admins').emit('roomsList', rooms);
    }
    async handleAdminReply(client, payload) {
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
        const rooms = await this.chatService.getAllRooms();
        this.server.to('admins').emit('roomsList', rooms);
    }
    async handleMessageRead(client, payload) {
        await this.chatService.updateMessageStatus(payload.messageId, 'read');
        this.server.to(payload.roomId).emit('statusUpdated', {
            messageId: payload.messageId,
            status: 'read',
        });
    }
    async handleGetPredefinedResponses(client) {
        const responses = await this.chatService.getPredefinedResponses();
        client.emit('predefinedResponsesList', responses);
    }
    async handleRequestTransfer(client, payload) {
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
    async handleAgentAcceptedTransfer(client, payload) {
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
    async handleRateChatSession(client, payload) {
        await this.chatService.rateChatSession(payload.roomId, payload.rating);
        this.server.to('admins').emit('chatRated', { roomId: payload.roomId, rating: payload.rating });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('adminJoin'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAdminJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('userJoin'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleUserJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('trackPage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTrackPage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('adminJoinRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAdminJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('adminReply'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAdminReply", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('messageRead'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessageRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getPredefinedResponses'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleGetPredefinedResponses", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('requestHumanTransfer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRequestTransfer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('agentAcceptedTransfer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleAgentAcceptedTransfer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rateChatSession'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRateChatSession", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/chat',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map